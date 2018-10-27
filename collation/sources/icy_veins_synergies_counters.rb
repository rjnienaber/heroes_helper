module Sources
  class SynergiesCounters < Base
    attr_reader :builds

    def initialize(browser, builds)
      super(browser)
      @builds = builds
    end

    private

    def retrieve_values
      basic = Hash[builds.values.map do |hero, page|
        synergies = page.css('.heroes_synergies a img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        counters = page.css('.heroes_counters a img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        [hero, {synergies: synergies, counters: counters}]
      end]

      # some hero synergies are not mutually listed so we run over each hero
      # again to ensure that they are
      basic.keys.each do |hero|
        heroes = basic.keys
        synergies = heroes.select { |h| basic[h][:synergies].include?(hero)}
        counters = heroes.select { |h| basic[h][:counters].include?(hero)}
        basic[hero][:synergies] = (basic[hero][:synergies] + synergies).uniq
        basic[hero][:counters] = (basic[hero][:counters] + counters).uniq
      end
      basic
    end
  end
end

