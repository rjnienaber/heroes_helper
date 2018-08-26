require 'nokogiri'
require 'pry'

module Sources
  class Browser
    attr_reader :cache_dir
    def initialize(cache_dir)
      @cache_dir = File.absolute_path(cache_dir)
    end

    def download_page(uri, cache_name)
      content = perform(cache_dir, cache_name) do |browser|
        browser.goto(uri)
        browser.html
      end
      Nokogiri::HTML(content)
    end

    def perform(full_cache_dir, cache_name, &block)
      file_name = "#{full_cache_dir}/#{cache_name}.html"
      if File.exist?(file_name)
        File.read(file_name)
      else
        content = block.call(browser)
        File.write(file_name, content)
        content
      end
    end

    def reset
      @browser.quit
      @browser = nil
    rescue => e
      p e
    end

    def browser
      @browser ||= create_browser
    end

    private

    def create_browser
      require 'watir'
      # Watir.default_timeout = 10
      b = Watir::Browser.new :chrome, :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate --disable-notifications --start-maximized --disable-gpu]
      b.driver.manage.timeouts.implicit_wait = 100 # seconds
      at_exit do
        b.quit
      end
      b
    end
  end
end
