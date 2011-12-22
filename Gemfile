source 'http://rubygems.org'

gem 'rails', '3.1.1'

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

# Asset template engines
gem 'sass'
gem 'coffee-script'
gem 'uglifier'
gem 'haml'
gem "sqlite3"

gem 'jquery-rails'
gem 'uglifier'

gem 'capistrano'
gem 'capistrano-ext'
gem 'faker'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
end

group :test, :development do
  gem 'guard'
  gem 'guard-coffeescript'
  gem 'guard-livereload'
  gem 'jasmine'
end

group :production do
  gem 'therubyracer'
end
