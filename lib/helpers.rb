require 'nanoc-sprockets-filter'

include Nanoc::Helpers::Capturing
include Nanoc::Helpers::Sprockets

def wines
  @wines ||= items.select {|item| item.identifier =~ /^\/wines/ }.sort {|a, b| a[:order] <=> b[:order] }
end

