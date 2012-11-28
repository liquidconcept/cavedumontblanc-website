# encoding: utf-8
#\ -w
$: << File.expand_path('..', __FILE__)

require 'rubygems' if RUBY_VERSION < '1.9'
require 'bundler/setup'
require 'sinatra/base'

#
# APPLICATION
#
module Application
  class Website < Sinatra::Base
    set :static, true
    set :public, File.expand_path('../../public', __FILE__)
  end
end

run Application::Website.new