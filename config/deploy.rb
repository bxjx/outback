#before :"deploy:symlink", :"deploy:assets"

desc "Compile asets"
task :assets do
  run "cd #{release_path}; RAILS_ENV=#{rails_env} bundle exec rake assets:precompile"
end

require 'capistrano/ext/multistage'

set :stages, %w(training production)
set :default_stage, "production"
set :application, "outback"
set :repository,  "gitosis@scm:outback.git"
set :scm, :git
role :web, "outback1"
role :app, "outback1"
role :db,  "outback1", :primary => true
set :user, "rails"
set :use_sudo, false

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

after "deploy:update_code", :roles => [:web] do
  run "cd #{release_path} && bundle install --path=~/.gems --deployment --without development test"
end
