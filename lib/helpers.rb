require 'sprockets-helpers'

include Nanoc::Helpers::Capturing
include Sprockets::Helpers

def wines
  @wines ||= items.select {|item| item.identifier =~ /^\/wines/ }.sort {|a, b| a[:order] <=> b[:order] }
end

