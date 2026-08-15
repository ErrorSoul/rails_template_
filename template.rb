# Rails app template — Telegram Mini App scaffolder
#
# Usage (direct):
#   rails new MyApp -d postgresql -m /path/to/this/template.rb -T --skip-jbuilder
#
# Preferred entry point — bin/scaffold, which sets ENV and runs `rails new`.
#
# Inputs (read from ENV, populated by bin/scaffold):
#   TG_APP_NAME      — display name (defaults to app_name)
#   TG_BOT_TOKEN     — Telegram bot token (kept in .env, NOT committed)
#   TG_ADMIN_LOGIN   — initial superuser login (defaults to "admin")
#   TG_ADMIN_PASS    — initial superuser password (defaults to "admin123")

require 'fileutils'

def source_paths
  [File.join(File.expand_path(File.dirname(__FILE__)), 'lib/templates/files'),
   File.join(File.expand_path(File.dirname(__FILE__)), 'lib/templates/erb'),
   File.expand_path(File.dirname(__FILE__))]
end

# ---- Inputs ----------------------------------------------------------------
@app_display_name = ENV['TG_APP_NAME'] || app_name.titleize
@bot_token        = ENV['TG_BOT_TOKEN'].to_s
@admin_login      = ENV['TG_ADMIN_LOGIN'] || 'admin'
@admin_pass       = ENV['TG_ADMIN_PASS']  || 'admin123'

say_status :tma, "Generating #{app_name} (display: #{@app_display_name})"

# ---- Gemfile ---------------------------------------------------------------
gem 'bcrypt', '~> 3.1'
gem 'jwt'
gem 'slim-rails'
gem 'rack-cors'
gem 'dotenv-rails'

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

# ---- Static files (mirror of Rails app) -----------------------------------
remove_file 'app/controllers/application_controller.rb'
remove_file 'app/views/layouts/application.html.erb'

# force: true everywhere — Rails 8.1 ships its own versions of several of these files
# (application_helper.rb, Dockerfile, .rubocop.yml, .dockerignore). Without force Thor asks
# "Overwrite ...? [Ynaqdhm]" and the scaffold hangs with stdin closed (CI, agents).
directory 'app/components', force: true
directory 'app/controllers', force: true
directory 'app/views', force: true
directory 'app/assets/stylesheets/design_system', force: true
directory 'app/javascript', force: true
directory 'app/helpers', force: true
directory 'app/models', force: true
directory 'config/initializers', force: true
directory 'lib/generators', force: true
copy_file 'config/routes.rb', force: true
copy_file 'Procfile.dev', force: true
copy_file '.rubocop.yml', force: true
copy_file '.dockerignore', force: true
copy_file '.githooks/pre-commit', force: true

# Dev-окружение («Ruby on Whales» без dip). Продакшн-Dockerfile от Rails 8.1 не трогаем —
# он про деплой, а .dockerdev/ про разработку.
# mode: :preserve обязателен: обычный copy_file кладёт 644, и ./run окажется неисполняемым.
directory '.dockerdev', force: true
copy_file 'run', force: true, mode: :preserve

# ---- ERB-rendered files (use @app_display_name etc.) ----------------------
template '.env.example.erb', '.env.example'
template 'config/initializers/tg_app.rb.erb', 'config/initializers/tg_app.rb', force: true

# ---- Post-bundle ----------------------------------------------------------
after_bundle do
  # Make hook executable now; activate hooksPath only AFTER initial commit
  # (otherwise the hook itself blocks the very first commit on main).
  run "chmod +x .githooks/pre-commit" rescue nil

  # Database
  rails_command 'db:create'

  # Migrations
  generate :migration, 'CreateSuperusers login:string:uniq password_digest:string'
  generate :migration, 'CreateUsers telegram_id:bigint:uniq first_name:string last_name:string username:string language_code:string is_premium:boolean photo_url:string'
  rails_command 'db:migrate'

  # Models — content already copied via directory 'app/models', migrations match.

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
    Superuser.find_or_create_by!(login: ENV.fetch('TG_ADMIN_LOGIN', '#{@admin_login}')) do |s|
      s.password = ENV.fetch('TG_ADMIN_PASS', '#{@admin_pass}')
    end
  RUBY
  rails_command 'db:seed'

  # .env (NOT committed — only created locally for dev)
  create_file '.env', force: true do
    <<~ENV
      TG_APP_NAME=#{@app_display_name}
      TG_BOT_TOKEN=#{@bot_token}
      TG_ADMIN_LOGIN=#{@admin_login}
      TG_ADMIN_PASS=#{@admin_pass}
    ENV
  end
  append_to_file '.gitignore', "\n# tma\n.env\n"

  # Initial commit (BEFORE activating the pre-commit hook, see above).
  git :init unless File.exist?('.git/HEAD')
  git add: '.'
  git commit: %Q[-m "scaffold via rails_template (TMA) — #{Time.now.utc.iso8601}"]

  # Activate githooks — from this point on, commits to main/master are blocked.
  run "git config core.hooksPath .githooks"

  say_status :tma, '✅ Done. Next steps:'
  say "
  cd #{app_name}
  ./run setup && ./run up     # либо bin/dev без докера
  cloudflared tunnel --url http://localhost:3000
  # → возьми HTTPS URL, в BotFather:
  #   /mybots → @YourBot → Bot Settings → Menu Button → URL = https://<tunnel>/tma
  # Открой бот в Telegram, нажми кнопку — должен открыться TMA.

  Admin: http://localhost:3000/admin   (login: #{@admin_login} / #{@admin_pass})
  TMA:   http://localhost:3000/tma     (через HTTPS-туннель)
  CRUD:  bin/rails g tma_resource Item \"title body:text\"
  "
end
