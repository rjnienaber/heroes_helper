require 'nokogiri'
require 'pry'

module Sources
  class Browser
    attr_reader :cache_dir
    def initialize(cache_dir)
      @cache_dir = File.absolute_path(cache_dir)
    end

    def download_page(uri, cache_name)
      file_name = "#{cache_dir}/#{cache_name}.html"
      content = if File.exist?(file_name)
        File.read(file_name)
      else
        browser.goto(uri)
        content = browser.html
        File.write(file_name, content)
        content
      end
      Nokogiri::HTML(content)
    end

    private

    def browser
      @browser ||= create_browser
    end

    def create_browser
      require 'watir'
      # Watir.default_timeout = 10
      b = Watir::Browser.new :chrome, :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate --disable-notifications --start-maximized --disable-gpu]
      b.driver.manage.timeouts.implicit_wait = 10 # seconds
      at_exit do
        b.quit
      end
      b
    end
  end
end