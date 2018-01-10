module Sources
  class Base
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
  end
end