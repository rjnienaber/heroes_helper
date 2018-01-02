module Formatters
  class Json
    attr_reader :output_file

    def initialize(output_file)
      @output_file = output_file
    end

    def format(data)
      File.write(output_file, ::JSON.dump(data))
    end
  end
end