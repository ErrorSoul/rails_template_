# Add the current directory to the path Thor uses
# to look up files
def source_paths
[File.join(File.expand_path(File.dirname(__FILE__)),'rails_root')]
end

run "dropdb #{app_name}_development"
run "dropdb #{app_name}_test"
remove_file "Gemfile"
copy_file('Gemfile')

remove_file 'app/views/application.html.erb'
remove_file 'app/assets/javascripts/application.js'
remove_file 'config/routes.rb'
remove_file 'app/helpers/application_helper.rb'
remove_file 'app/views/layouts/application.html.erb'
copy_file   'app/assets/javascripts/application.js'
copy_file   'app/assets/javascripts/admin.js'
copy_file   'app/assets/stylesheets/application.scss'
copy_file   'app/assets/stylesheets/admin.scss'
copy_file   'config/routes.rb'
copy_file   'Procfile'

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


directory 'app/views'
directory 'app/helpers'
directory 'app/controllers'
directory 'app/components'
# copy_file 'app/controllers/admin/base_controller.rb'
# copy_file 'app/controllers/authentication/sessions_controller.rb'
# copy_file 'app/controllers/mains_controller.rb'
# copy_file 'app/controllers/admin/dashboards_controller.rb'



inside 'config' do
  remove_file 'database.yml'
  create_file 'database.yml' do <<-EOF

default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

development:
  <<: *default
  database: #{app_name}_development


test:
  <<: *default
  database: #{app_name}_test

production:
  <<: *default
  database: #{app_name}_production
  username: #{app_name}
  password: <%= ENV['#{app_name.upcase}_DATABASE_PASSWORD'] %>

EOF
  end
end

after_bundle do
 rake  'db:create'
 rake  'db:migrate'

  generate('kaminari:views bootstrap4 -e slim')
  rails_command('webpacker:install')
  rails_command('webpacker:install:react')

  git :init
  git add: "."
  git commit: "-a -m 'Initial commit'"
end
