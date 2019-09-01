module Sources
  class Base
    include Common

    attr_accessor :browser
    def initialize(browser)
      @browser = browser
    end

    def heroes
      values.keys
    end

    def [](key)
      values[key]
    end

    def values
      @values ||= normalize_values(retrieve_values)
    end
  end
end