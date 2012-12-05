# encoding: utf-8
require 'sinatra/base'
require 'pony'

require File.expand_path('../../config/application', __FILE__)

module Application
  class Website < Sinatra::Base
    set :static, true
    set :public, File.expand_path('../../public', __FILE__)

    # Contact form
    post '/command' do
      template = ERB.new(File.read(File.expand_path('../templates/command_email.text.erb', __FILE__)))

      Pony.mail(
        :from     => params[:email],
        :to       => CONTACT_EMAIL_TO,
        :charset  => 'utf-8',
        :subject  => CONTACT_SUBJECT_PREFIX,
        :body     => template.result(binding)
      )
    end
  end
end