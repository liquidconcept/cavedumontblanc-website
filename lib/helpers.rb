include Nanoc::Helpers::Capturing

def wines
  @wines ||= items.select {|item| item.identifier =~ /^\/wines/ }.sort {|a, b| a[:order] <=> b[:order] }
end

