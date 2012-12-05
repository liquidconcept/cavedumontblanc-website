require 'tempfile'
require 'uglifier'

module Filters
  class SprocketFilter < Nanoc::Filter
    identifier :sprockets
    type :text

    def run(content, params = {})
      filename = File.basename(@item[:filename])
      if asset = Assets[filename]
        f = Tempfile.new 'sprockets.tmp'
        f.close
        asset.write_to f.path
        output = IO.read(f.path)
        if filename =~ /js$/
          output = Uglifier.compile(output, {
            :beautify => development?
          })
        end
        return output
      else
        puts "error locating #{filename} / #{@item[:filename]}"
      end
    end

  end
end
