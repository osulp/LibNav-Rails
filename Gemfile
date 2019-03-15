# frozen_string_literal: true

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Base Rails Gems
gem 'coffee-rails', '~> 4.2'
gem 'haml'
gem 'jbuilder', '~> 2.5'
gem 'rails', '~> 5.1.4'
gem 'rails-html-sanitizer', '~> 1.0.4'
gem 'sass-rails', '~> 5.0'
gem 'sprockets', '~> 3.7.2'
gem 'sqlite3'
gem 'turbolinks', '~> 5'
gem 'uglifier', '>= 1.3.0'

gem 'mysql2'

# Use Puma as the app server
gem 'puma', '~> 3.7'
gem 'puma_worker_killer'

# Bootstrap/UI gems
gem 'bootstrap', '~> 4.3'
gem 'jquery-rails'

# Use Capistrano for deployment
gem 'capistrano', '~> 3.8.0'
gem 'capistrano-rails'
gem 'capistrano-rbenv'
gem 'capistrano-nvm'
gem 'capistrano-passenger'
gem 'capistrano-yarn'
gem 'capistrano3-puma'

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

gem 'react-rails'

# Searching Library for model searching
gem "scoped_search"

gem 'devise_cas_authenticatable'
gem 'rubycas-client', git: 'https://github.com/osulp/rubycas-client'
gem 'rubycas-client-rails', git: 'https://github.com/osulp/rubycas-client-rails'

gem 'ffi', '~> 1.9.24'

# Security audit update
gem 'activejob', '>= 5.1.6.1'
gem 'loofah', '>= 2.2.3'
gem 'rack', '>= 2.0.6'
gem 'rubyzip', '>= 1.2.2'

group :production, :staging do
  gem 'ddtrace'
end

# Testing/Development gems
group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'rails-controller-testing'
  gem 'rspec-rails', '~> 3.6'
end

# Development Environment Gems
group :development, :staging do
  gem 'debride'
  gem 'fasterer'
  gem 'fastri'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'rcodetools'
  gem 'reek'
  gem 'rubocop'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara'
  gem 'coveralls'
  gem 'database_cleaner'
  gem 'equivalent-xml'
  gem 'poltergeist'
  gem 'rspec'
  gem 'rspec-mocks'
  gem 'rspec_junit_formatter'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers', git: 'https://github.com/thoughtbot/shoulda-matchers.git', branch: 'rails-5'
  gem 'simplecov'
  gem 'webmock'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
