module Formatters
  class Yaml
    attr_reader :output_file

    def initialize(output_file)
      @output_file = output_file
    end

    def format(data)
      File.write(output_file, data.to_yaml)
    end
  end
end