# encoding: utf-8
set :application, 'website'
set :domain,      'cavedumontblanc.ch'
set :server_name, 'ruby-rack-2.liquid-concept.ch'

set :scm,         :git
set :repository,  'git@github.com:liquidconcept/cavedumontblanc-website.git'
set :branch,      'production'

ssh_options[:forward_agent] = true

default_run_options[:pty] = true
default_environment['LC_CTYPE'] = 'en_US.UTF-8'

set :user,        'webpublisher'
set :deploy_via,  :copy
set :deploy_to,   "/var/www/#{domain}/#{application}"
set :use_sudo,    false

set :bundle_without, [:nanoc, :development, :test, :guard]

role :web, server_name                          # Your HTTP server, Apache/etc
role :app, server_name                          # This may be the same as your `Web` server
role :db,  server_name, :primary => true        # This is where Rails migrations will run

set :copy_exclude, ".git/*"
set :build_script, "bundle install && RACK_ENV=\"production\" bundle exec nanoc compile"

namespace :deploy do
  task :start, :roles => :app do
    run "mkdir -p #{File.join(current_path,'tmp')}"
    run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "mkdir -p #{File.join(current_path,'tmp')}"
    run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

before 'deploy:symlink' do
end

after 'deploy:update', 'deploy:restart'
after 'deploy:update', 'deploy:cleanup'
