module Sources
  module HotsLogsExport
    class ReplayProcessor
      attr_reader :winning_heroes, :losing_heroes, :composition_stats, :current_replay, :replays, :hero_lookup
      attr_reader :map_lookup, :seven_days_ago

      def initialize(hero_lookup, map_lookup, replays)
        @composition_stats = {}
        @replays = replays
        @hero_lookup = hero_lookup
        @map_lookup = map_lookup
        @seven_days_ago = Date.today - 60
        reset
      end

      def process(replay_id, hero_id, is_winner)
        @current_replay = replays[replay_id] if current_replay == nil

        if current_replay.nil? || current_replay[:timestamp] < self.seven_days_ago
          reset
          return
        end

        hero = hero_lookup[hero_id]
        hero.increment(is_winner)

        if replay_id != current_replay[:replay_id]
          puts "Invalid replay: #{replay_id}"
          reset
          return
        end

        if is_winner
          winning_heroes << hero
        else
          losing_heroes << hero
        end

        if winning_heroes.length == 5 && losing_heroes.length == 5
          # do map composition
          find_composition_stat(current_replay[:map_id], winning_heroes).increment(true)
          find_composition_stat(ALL_MAPS_ID, winning_heroes).increment(true)
          find_composition_stat(current_replay[:map_id], losing_heroes).increment(false)
          find_composition_stat(ALL_MAPS_ID, losing_heroes).increment(false)

          reset
        end
      end

      private
      def reset
        @winning_heroes = []
        @losing_heroes = []
        @current_replay = nil
      end

      def find_composition_stat(map_id, heroes)
        sub_groups = heroes.map { |h| h.subgroup }.sort
        key = map_id.to_s + "-" + sub_groups.map { |g| g[0..1] }.join
        composition_stat = composition_stats[key]
        if composition_stat.nil?
          composition_stat = composition_stats[key] = CompositionStat.new(map_id, sub_groups)
        end

        composition_stat
      end
    end
  end
end
