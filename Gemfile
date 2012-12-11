# encoding: utf-8
source "http://rubygems.org"

gem 'rack', '1.4.1'
gem 'nanoc'
gem 'sinatra'
gem 'pony'

gem 'sprockets'
gem 'sprockets-sass'
gem 'sprockets-helpers'
gem 'sass'
gem 'compass'
gem 'uglifier'
gem 'libv8', '~> 3.11.8'
gem 'therubyracer'
gem 'nanoc-sprockets-filter'
gem 'nanoc-gzip-filter'

group :production, :staging do
end

group :development do
  gem 'capistrano'
  gem 'railsless-deploy'
end

group :development, :test do
end

group :guard do
  gem 'rb-fsevent'
  gem 'guard'

  gem 'guard-bundler'

  gem 'livereload'
  gem 'guard-livereload'
end

