# Base layer — Rails 8 + Docker (./run) + admin panel + superuser auth + rubocop.
# No Telegram: everything TG-specific lives in lib/templates/tma.rb.
#
# Applied from template.rb via `apply`, which instance_eval's this file on the very
# same generator object. So @app_display_name & co. come from there, and source_paths
# must NOT be redefined here — see the comment in template.rb.

# ---- Gemfile ---------------------------------------------------------------
gem 'bcrypt', '~> 3.1'
gem 'jwt'
gem 'slim-rails'
gem 'dotenv-rails'
# 3.11+ обязателен: 3.0.x требует railties < 8 и на Rails 8.1 просто не встанет.
gem 'vite_rails', '~> 3.11'

gem_group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'database_cleaner-active_record'
  gem 'shoulda-matchers'
  gem 'faker'
  gem 'pry-rails'
end

gem_group :development do
  gem 'annotate'
end

# ---- Application config ----------------------------------------------------
application do
  <<~RUBY
    config.generators do |g|
      g.template_engine :erb
      g.test_framework :rspec, fixture_replacement: :factory_bot
      g.factory_bot dir: "spec/factories"
      g.helper false
      g.assets false
    end
  RUBY
end

# ---- Static files (mirror of a Rails app) ----------------------------------
remove_file 'app/controllers/application_controller.rb'
remove_file 'app/views/layouts/application.html.erb'

# Every source is prefixed with the layer's own directory: `directory` resolves to
# exactly ONE source tree (thor/lib/thor/actions/directory.rb:59), it never merges
# two of them. Without the prefix the tma overlay's app/controllers would silently
# lose to base's — first match in source_paths wins.
#
# force: true everywhere — Rails 8.1 ships its own versions of several of these files
# (application_helper.rb, .rubocop.yml, .dockerignore). Without force Thor asks
# "Overwrite ...? [Ynaqdhm]" and the scaffold hangs with stdin closed (CI, agents).
directory 'base/files/app/components', 'app/components', force: true
directory 'base/files/app/controllers', 'app/controllers', force: true
directory 'base/files/app/views', 'app/views', force: true
directory 'base/files/app/assets/stylesheets/design_system', 'app/assets/stylesheets/design_system', force: true
directory 'base/files/app/helpers', 'app/helpers', force: true
directory 'base/files/app/models', 'app/models', force: true
directory 'base/files/lib/generators', 'lib/generators', force: true
copy_file 'base/files/config/routes.rb', 'config/routes.rb', force: true

# Фронтенд: вендоренный design_system (ds/), энтрипоинты, стили.
# Всё, что здесь лежит, собирает Vite; sprockets остаётся только под ERB-админку.
directory 'base/files/app/frontend', 'app/frontend', force: true
copy_file 'base/files/package.json', 'package.json', force: true
copy_file 'base/files/vite.config.ts', 'vite.config.ts', force: true
copy_file 'base/files/vitest.config.ts', 'vitest.config.ts', force: true
copy_file 'base/files/tsconfig.json', 'tsconfig.json', force: true
copy_file 'base/files/config/vite.json', 'config/vite.json', force: true
# mode: :preserve — иначе бинстаб приедет с 644 и `bin/vite dev` в compose не запустится.
copy_file 'base/files/bin/vite', 'bin/vite', force: true, mode: :preserve
copy_file 'base/files/Procfile.dev', 'Procfile.dev', force: true
copy_file 'base/files/.rubocop.yml', '.rubocop.yml', force: true
copy_file 'base/files/.dockerignore', '.dockerignore', force: true
copy_file 'base/files/.githooks/pre-commit', '.githooks/pre-commit', force: true

# Dev-окружение («Ruby on Whales» без dip). Продакшн-Dockerfile от Rails 8.1 не трогаем —
# он про деплой, а .dockerdev/ про разработку.
# mode: :preserve обязателен: обычный copy_file кладёт 644, и ./run окажется неисполняемым.
directory 'base/files/.dockerdev', '.dockerdev', force: true
copy_file 'base/files/run', 'run', force: true, mode: :preserve

template 'base/erb/.env.example.erb', '.env.example'

# ---- Post-bundle ----------------------------------------------------------
# after_bundle callbacks fire in registration order across all applied files
# (railties app_generator.rb:593 — plain Array#each), so this block runs before
# tma.rb's and before template.rb's finalize block.
after_bundle do
  # Make hook executable now; activate hooksPath only AFTER initial commit
  # (otherwise the hook itself blocks the very first commit on main).
  run "chmod +x .githooks/pre-commit" rescue nil

  rails_command 'db:create'

  generate :migration, 'CreateSuperusers login:string:uniq password_digest:string'
  rails_command 'db:migrate'

  # RSpec
  generate 'rspec:install'
  append_to_file '.rspec', "--format documentation\n"
  # rspec-rails ships this commented out. Without it specs get no `type:` metadata,
  # and shoulda-matchers — which hooks on `type: :model` — silently provides nothing:
  # `validate_presence_of` raises NoMethodError.
  gsub_file 'spec/rails_helper.rb',
            '# config.infer_spec_type_from_file_location!',
            'config.infer_spec_type_from_file_location!'
  inject_into_file 'spec/rails_helper.rb', after: "require 'rspec/rails'\n" do
    <<~RUBY
      require 'database_cleaner/active_record'
    RUBY
  end
  inject_into_file 'spec/rails_helper.rb', after: "RSpec.configure do |config|\n" do
    <<~RUBY.indent(2)
      config.include FactoryBot::Syntax::Methods
      config.before(:suite) do
        DatabaseCleaner.strategy = :transaction
        DatabaseCleaner.clean_with(:truncation)
      end
      config.around(:each) { |ex| DatabaseCleaner.cleaning { ex.run } }

      Shoulda::Matchers.configure do |c|
        c.integrate { |with| with.test_framework :rspec; with.library :rails }
      end
    RUBY
  end

  # Seed initial superuser
  append_to_file 'db/seeds.rb', <<~RUBY
    Superuser.find_or_create_by!(login: ENV.fetch('ADMIN_LOGIN', '#{@admin_login}')) do |s|
      s.password = ENV.fetch('ADMIN_PASS', '#{@admin_pass}')
    end
  RUBY
  rails_command 'db:seed'

  # .env (NOT committed — only created locally for dev)
  create_file '.env', force: true do
    <<~ENV
      APP_NAME=#{@app_display_name}
      ADMIN_LOGIN=#{@admin_login}
      ADMIN_PASS=#{@admin_pass}
    ENV
  end
  append_to_file '.gitignore', <<~IGNORE

    # local env
    .env

    # Vite
    /public/vite*
    node_modules/
    *.local
  IGNORE

  # node_modules нужен Vite'у: в dev `autoBuild` собирает бандл на первый запрос,
  # и без зависимостей страница админки отдала бы 500. В докере то же самое делает
  # `./run setup` на Node 24.
  #
  # Намеренно `system`, а не thor'овский `run`: `run` при ненулевом коде обрывает
  # весь генератор, и неподходящий Node на хосте уносил бы с собой git init,
  # первый коммит и next-steps. Докер-путь от хостового yarn не зависит.
  if system('command -v yarn > /dev/null 2>&1')
    say_status :run, 'yarn install'
    unless system('yarn install')
      say_status :scaffold,
                 'yarn install не прошёл — фронтенд соберётся в докере (./run setup). ' \
                 'Для сборки на хосте нужен Node 22.22+ или 24.15+: нечётные линии вне спеки ' \
                 'vitest/jsdom.',
                 :yellow
    end
  end
end

@next_steps << "  Admin: http://localhost:3000/admin   (login: #{@admin_login} / #{@admin_pass})"
@next_steps << '  CRUD:  bin/rails g tma_resource Item "title body:text"'
