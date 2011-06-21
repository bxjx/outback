before :"deploy:symlink", :"deploy:assets"

desc "Compile asets"
task :assets do
  run "cd #{release_path}; RAILS_ENV=#{rails_env} bundle exec rake assets:precompile"
end
