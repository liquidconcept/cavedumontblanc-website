# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.
include Nanoc3::Helpers::Capturing

def vines
  @vines ||= items.select {|item| item.identifier =~ /^\/vins/ }.sort {|a, b| a[:order] <=> b[:order] }
end