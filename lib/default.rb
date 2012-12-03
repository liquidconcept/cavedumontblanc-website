# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.
include Nanoc3::Helpers::Capturing

def wines
  @wines ||= items.select {|item| item.identifier =~ /^\/wines/ }.sort {|a, b| a[:order] <=> b[:order] }
end