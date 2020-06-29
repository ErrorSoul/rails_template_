# Add the current directory to the path Thor uses
# to look up files
def source_paths
[File.join(File.expand_path(File.dirname(__FILE__)),'rails_root')]
end

run "dropdb #{app_name}_development --if-exists"
run "dropdb #{app_name}_test --if-exists"
remove_file "Gemfile"
copy_file('Gemfile')
remove_file 'config/database.yml'
template 'config/database.erb', 'config/database.yml'

application do
  %Q[
     config.i18n.default_locale = :ru
     config.generators do |g|
       g.template_engine :slim
     end
     config.generators.system_tests = :rspec
    ]
end

directory 'app/components'

remove_file 'config/routes.rb'
copy_file   'config/routes.rb'

# remove_file 'app/views/application.html.erb'
# remove_file 'app/assets/javascripts/application.js'
# remove_file 'config/routes.rb'
# remove_file 'app/helpers/application_helper.rb'
# remove_file 'app/views/layouts/application.html.erb'
# copy_file   'app/assets/javascripts/application.js'
# copy_file   'app/assets/javascripts/admin.js'
# copy_file   'app/assets/stylesheets/application.scss'
# copy_file   'app/assets/stylesheets/admin.scss'
# copy_file   'config/routes.rb'
# copy_file   'Procfile'

# %w[flash_messages_helper.rb label_status_helper.rb].each do |helper|
#   copy_file "app/helpers/#{helper}"
# end

# %w[application.html.slim admin.html.slim session.html.slim].each do |layout|
#   copy_file "app/views/layouts/#{layout}"
# end

# copy_file 'app/views/mains/index.html.slim'
# copy_file 'app/views/authentication/sessions/new.html.slim'
# copy_file 'app/views/application/_navbar.html.slim'
# copy_file 'app/views/dashboards/index.html.slim'


# directory 'app/views'
# directory 'app/helpers'
# directory 'app/controllers'

# copy_file 'app/controllers/admin/base_controller.rb'
# copy_file 'app/controllers/authentication/sessions_controller.rb'
# copy_file 'app/controllers/mains_controller.rb'
# copy_file 'app/controllers/admin/dashboards_controller.rb'



# inside 'config' do
#   remove_file 'database.yml'
#   create_file 'database.yml' do <<-EOF

# default: &default
#   adapter: postgresql
#   encoding: unicode
#   pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

# development:
#   <<: *default
#   database: #{app_name}_development


# test:
#   <<: *default
#   database: #{app_name}_test

# production:
#   <<: *default
#   database: #{app_name}_production
#   username: #{app_name}
#   password: <%= ENV['#{app_name.upcase}_DATABASE_PASSWORD'] %>

# EOF
#   end
# end

# after_bundle do

#   run 'spring stop'
#   generate('devise:install')

#   generate('devise User')
#   remove_file 'config/locales/en.yml'
#   copy_file 'config/locales/en.yml'
#   copy_file 'config/stations.yml'




#   gsub_file 'config/routes.rb', "devise_for :users", "devise_for :users, path_names: {sign_in: 'login'}, controllers: { sessions: 'authentication/sessions' }"
#   #generate('react:install')
#   rake  'db:create'
#   generate('model category name')
#   generate('model station name')
#   generate(:migration, "AddNameToUsers first_name:string last_name:string role:string category_id:integer")
#   remove_file('db/seeds.rb')
#   copy_file('db/seeds.rb')
#   copy_file('app/models/ability.rb')
#   rake  'db:migrate'
#   rake  'db:seed'
#   generate('kaminari:views bootstrap4 -e slim')
#   rails_command('webpacker:install')
#   copy_file 'app/javascript/packs/hello.scss'
#   copy_file 'app/javascript/packs/hello_first.jsx'
#   rails_command('webpacker:install:react')
#   append_to_file 'app/javascript/packs/application.js', %Q[import 'packs/hello_first']
#   run 'yarn add antd'

#   git :init
#   git add: "."
#   git commit: "-a -m 'Initial commit'"
# end
after_bundle do
  run 'spring stop'
  rails_command 'generate rspec:install'
  append_to_file '.rspec', '--format d'
  rails_command 'g annotate:install'

  gsub_file 'spec/rails_helper.rb',
    "# Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }",
    "Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }"

  inject_into_file 'spec/rails_helper.rb', after: "require 'rspec/rails'" do <<-'RUBY'
    require 'database_cleaner/active_record'
  RUBY
  end

  inject_into_file 'spec/rails_helper.rb', after: "RSpec.configure do |config|\n" do <<-'RUBY'.indent(2)
    config.include FactoryBot::Syntax::Methods
    config.include Requests::JsonHelpers, type: :request

    # Database Cleaner
    config.before(:suite) do
      DatabaseCleaner.strategy = :transaction
      DatabaseCleaner.clean_with(:truncation)
    end

    config.around(:each) do |example|
      DatabaseCleaner.cleaning do
        example.run
      end
    end

    # Shoulda matcher

   Shoulda::Matchers.configure do |config|
    config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
    end
   end

  RUBY
  end

  directory 'spec/support'
  copy_file('spec/support/request_helpers.rb')


  # migration
  generate('model Superuser login password')

  ##########
  git :init
  git add: "."
  git commit: "-a -m 'Initial commit'"

end
