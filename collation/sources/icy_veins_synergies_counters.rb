module Sources
  class SynergiesCounters < Base
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
        synergies = page.css('.heroes_tldr_matchups_works_well_with img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        counters = page.css('.heroes_tldr_matchups_countered_by img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        [hero, {synergies: synergies, counters: counters}]
      end]
    end
  end
end

