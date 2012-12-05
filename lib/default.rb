require 'rubygems'
require 'bundler/setup'

require 'sprockets'
require 'sprockets-sass'
require 'compass'

# Env
ROOT = File.expand_path(File.join __FILE__, '..', '..') unless defined? ROOT

def production?
  ENV['RACK_ENV'] == 'production'
end

def development?
  !production?
end

# Compass
Compass.add_project_configuration 'config/compass.rb'

# Assets
nanoc_stderr = $stderr
$stderr = STDERR
Assets = Sprockets::Environment.new(ROOT) do |env|
  assets =  ['javascripts', 'stylesheets', 'images', 'fonts']
  paths =   ['content/assets/', 'lib/', 'vendor/assets/' ].map{|p| assets.map{|f| "#{p}#{f}" } }.flatten

  paths.each{ |path| env.append_path path }
end unless defined? Assets
$stderr = nanoc_stderr

