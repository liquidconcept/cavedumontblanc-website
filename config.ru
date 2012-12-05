# encoding: utf-8
#\ -w
$: << File.expand_path('..', __FILE__)

require 'rubygems' if RUBY_VERSION < '1.9'
require 'bundler/setup'

#
# APPLICATION
#
require 'app/website'

run Application::Website.new