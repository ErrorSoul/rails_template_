# Add the current directory to the path Thor uses
# to look up files
def source_paths
[File.join(File.expand_path(File.dirname(__FILE__)),'rails_root')]
end

run "dropdb #{app_name}_development"
run "dropdb #{app_name}_test"
remove_file "Gemfile"
copy_file('Gemfile')

application do
  %Q(
  config.i18n.default_locale = :ru
  config.generators do |g|
    g.template_engine :slim
  end
  config.generators.system_tests = :rspec
  )
end

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
# directory 'app/components'
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

  git :init
  git add: "."
  git commit: "-a -m 'Initial commit'"

end
