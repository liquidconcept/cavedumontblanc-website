# encoding: utf-8
$: << File.expand_path('../..', __FILE__)

require 'rubygems' if RUBY_VERSION < '1.9'
require 'bundler/setup'

require 'sprockets'
require 'sprockets-sass'
require 'sass'
require 'uglifier'
require 'compass'
require 'nanoc-sprockets-filter'
require 'vendor/filters/gzip'

#
# Compass
#
Compass.add_project_configuration 'config/compass.rb'

#
# Sprockets
#
Sprockets::Helpers.configure do |config|
  config.environment = Nanoc::Filters::Sprockets.environment
  config.prefix      = '/assets'
  config.digest      = true
end

# Fix bug with Sprockets namespace
module Sprockets
  module Sass
    Engine = ::Sass::Engine
  end
end if defined? ::Sass::Engine

#
# Nanoc
#
module Nanoc
  def self.production?
    ENV['RACK_ENV'] == 'production'
  end

  def self.development?
    !production?
  end
end

