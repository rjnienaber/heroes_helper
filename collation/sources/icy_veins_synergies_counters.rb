module Sources
  class SynergiesCounters < Base
    attr_reader :builds

    def initialize(browser, builds)
      super(browser)
      @builds = builds
    end

    private

    def retrieve_values
      basic = Hash[builds.values.map do |hero, download|
        synergies = download[:page].css('.heroes_synergies a img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        counters = download[:page].css('.heroes_counters a img').map { |img| img.attributes['title'] ? img.attributes['title'].value : nil }.compact
        [hero, {synergies: synergies, countered_by: counters}]
      end]

      # some hero synergies are not mutually listed so we run over each hero
      # again to ensure that they are
      basic.keys.each do |hero|
        heroes = basic.keys
        synergies = heroes.select { |h| basic[h][:synergies].include?(hero)}
        basic[hero][:synergies] = (basic[hero][:synergies] + synergies).uniq
      end
      basic
    end
  end
end

