# make sure you've run 'hots_api_big_query.sh' script first
require 'csv'
require_relative 'hero_talents'
require_relative 'composition_stat'

module Sources
  module Parsers
    class HotsApiExport
      attr_reader :hero_map, :composition_stats

      def initialize(hero_map)
        @hero_map = hero_map
        @composition_stats = {}
      end

      def parse(filename)
        current__id = nil
        winning_subgroups = nil
        losing_subgroups = nil

        CSV.foreach(filename) do |row|
          next if row.empty? || row[0].include?('r_id')
          id, map, hero_name, result = row
          won = result == '1'

          if id != current__id
            if winning_subgroups && winning_subgroups.length == 5
              update_composition_stats(map, winning_subgroups, true)
              update_composition_stats('all', winning_subgroups, true)
            end

            if losing_subgroups && losing_subgroups.length == 5
              update_composition_stats(map, losing_subgroups, false)
              update_composition_stats('All Maps', losing_subgroups, false)
            end
            winning_subgroups = []
            losing_subgroups = []
          end

          current__id = id

          next if hero_name.nil?

          hero = hero_map[hero_name]

          if won
            winning_subgroups << hero.subgroup
          else
            losing_subgroups << hero.subgroup
          end

          hero.increment(won)
        end

        heroes = Hash[hero_map.map { |k,v| [k, (v.win_percentage * 100).round(2)]}]

        [composition_stats, heroes]
      end

      private
      def update_composition_stats(map, subgroups, won)
        key = "#{map}-#{subgroups.sort.join}"
        composition_stat = composition_stats[key]
        if composition_stat.nil?
          composition_stat = composition_stats[key] = CompositionStat.new(map, subgroups)
        end

        composition_stat.increment(won)
      end
    end
  end
end


if __FILE__ == $0
  export = Sources::Parsers::HeroTalents.new
  hero_map = export.parse('/tmp/heroes-talents')

  export = Sources::Parsers::HotsApiExport.new(hero_map)
  composition_stats = export.parse('/tmp/map_results.csv')
  p hero_map['Alarak'].win_percentage
  p composition_stats.values[0]
end