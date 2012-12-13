module Nanoc
  module Filters
    class ImageMagick < Nanoc::Filter
      type :binary

      def run(filename, params={})
        cmd = ['convert']

        cmd << ['-rotate', params[:rotate].to_s] if params[:rotate]
        cmd << ['-resize', params[:resize].to_s] if params[:resize]

        cmd << filename
        cmd << output_filename

        system(cmd.flatten.join(' '))
      end

    end
  end
end

Nanoc::Filter.register '::Nanoc::Filters::ImageMagick', :imagemagick

