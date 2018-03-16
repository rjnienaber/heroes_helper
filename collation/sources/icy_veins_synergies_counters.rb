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
      basic = Hash[builds.values.map do |hero, page|
        synergies = page.css('.heroes_tldr_matchups_works_well_with img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        counters = page.css('.heroes_tldr_matchups_countered_by img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        [hero, {synergies: synergies, counters: counters}]
      end]

      # some hero synergies are not mutually listed so we run over each hero
      # again to ensure that they are
      basic.keys.each do |hero|

        # heroes = basic.keys.select { |h| h != hero }
        heroes = basic.keys
        synergies = heroes.select { |h| basic[h][:synergies].include?(hero)}
        counters = heroes.select { |h| basic[h][:counters].include?(hero)}
        basic[hero][:synergies] = (basic[hero][:synergies] + synergies).uniq
        basic[hero][:counters] = (basic[hero][:counters] + synergies).uniq
      end
      basic
    end
  end
end

