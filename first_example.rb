# Add the current directory to the path Thor uses
# to look up files
def source_paths
[File.join(File.expand_path(File.dirname(__FILE__)),'rails_root')]
end


remove_file "Gemfile"
copy_file('Gemfile')

remove_file 'app/views/application.html.erb'
remove_file 'app/assets/javascripts/application.js'
remove_file 'config/routes.rb'
remove_file 'app/views/layouts/application.html.erb'
copy_file   'app/assets/javascripts/application.js'
copy_file   'app/assets/javascripts/admin.js'
copy_file   'app/assets/stylesheets/application.scss'
copy_file   'app/assets/stylesheets/admin.scss'
copy_file   'config/routes.rb'



%w[flash_messages_helper.rb label_status_helper.rb].each do |helper|
  copy_file "app/helpers/#{helper}"
end

%w[application.html.slim admin.html.slim session.html.slim].each do |layout|
  copy_file "app/views/layouts/#{layout}"
end

copy_file 'app/views/mains/index.html.slim'
copy_file 'app/views/authentication/sessions/new.html.slim'




copy_file 'app/controllers/admin/base_controller.rb'
copy_file 'app/controllers/authentication/sessions_controller.rb'
copy_file 'app/controllers/mains_controller.rb'



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

  system('spring stop')
  generate('devise:install')

  generate('devise User')


  gsub_file 'config/routes.rb', "devise_for :users, path_names: {sign_in: 'login'}, controllers: { sessions: 'authentication/sessions' }"
  generate('react:install')
  rake  'db:create'
  rake  'db:migrate'

  git :init
  git add: "."
  git commit: "-a -m 'Initial commit'"
end