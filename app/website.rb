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
      template = ERB.new(File.read(File.expand_path('../templates/command_email.text.erb', __FILE__), :encoding => 'UTF-8'))

      Pony.mail(
        :from     => params[:bild_address][:email],
        :to       => COMMAND_EMAIL_TO,
        :charset  => 'utf-8',
        :subject  => COMMAND_SUBJECT,
        :body     => template.result(binding)
      )

      'ok'
    end
  end
end
