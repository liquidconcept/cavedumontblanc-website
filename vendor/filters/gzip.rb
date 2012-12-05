require 'stringio'
require 'zlib'

module Nanoc
  module Filters
    class Gzip < Nanoc::Filter

      def run(content, params = {})
        io = StringIO.new

        gz = Zlib::GzipWriter.new(io, Zlib::BEST_COMPRESSION)
        gz.mtime = mtime.to_i
        gz.write content
        gz.close

        io.string
      end

      def mtime
        File.mtime(item[:filename])
      end

    end
  end
end

Nanoc::Filter.register '::Nanoc::Filters::Gzip', :gzip

