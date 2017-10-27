# frozen_string_literal: true

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Base Rails Gems
gem 'rails', '~> 5.1.4'
gem 'sqlite3'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'

# Use Puma as the app server
gem 'puma', '~> 3.7'
gem 'puma_worker_killer'

# Bootstrap/UI gems
gem 'bootstrap', '~> 4.0.0.beta'
gem 'jquery-rails'

# Use Capistrano for deployment
gem 'capistrano', '~> 3.8.0'
gem 'capistrano-rails'
gem 'capistrano-passenger'
gem 'capistrano-rbenv'
gem 'capistrano3-puma'
gem 'capistrano-nvm'
gem 'capistrano-yarn'

# Use webpacker to support ES6 javascript
gem 'webpacker', github: 'rails/webpacker'

# User Generation, Authorization, and Authentication, Admin
gem 'devise'
gem 'rails_admin', '~> 1.2'

# For form formatting.
gem 'simple_form'

# Use paperclip for svg uploads
gem 'paperclip'

# Use fontawesome for icons
gem 'font-awesome-sass'

# Testing/Development gems
group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'rspec-rails', '~> 3.6'
  gem 'rails-controller-testing'
end

# Development Environment Gems
group :development, :staging do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'rcodetools'
  gem 'fastri'
  gem 'reek'
  gem 'debride'
  gem 'fasterer'
  gem 'rubocop'
end

group :test do
  gem 'coveralls'
  gem 'rspec_junit_formatter'
  gem 'rspec'
  gem 'rspec-mocks'
  gem 'simplecov'
  gem 'webmock'
  gem 'poltergeist'
  gem 'capybara'
  gem 'database_cleaner'
  gem 'equivalent-xml'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers', git: 'https://github.com/thoughtbot/shoulda-matchers.git', branch: 'rails-5'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
