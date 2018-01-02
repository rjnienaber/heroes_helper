module Sources
  class Maps < Base
    attr_reader :builds

    def initialize(browser, builds)
      super(browser)
      @builds = builds
    end

    def values
      @maps ||= get_maps
    end

    private

    def get_maps
      Hash[builds.values.map do |hero, page|
        strong = page.css('.heroes_tldr_maps_stronger img').map { |img| img.attributes['alt'].value }
        average = page.css('.heroes_tldr_maps_average img').map { |img| img.attributes['alt'].value }
        weak = page.css('.heroes_tldr_maps_weaker img').map { |img| img.attributes['alt'].value }
        [hero, {strong: strong, average: average, weak: weak}]
      end]
    end
  end
end

