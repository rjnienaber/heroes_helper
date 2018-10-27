module Sources
  module HotsLogsExport
    class CompositionStat
      attr_reader :map_id, :subgroups, :games, :games_won

      def initialize(map_id, subgroups)
        @map_id = map_id
        @subgroups = subgroups
        @games = 0
        @games_won = 0
      end

      def increment(won)
        @games += 1
        @games_won += 1 if won
      end

      def win_percentage
        games_won.to_f / games
      end
    end
  end
end
