module Sources
  module HotsLogsExport
    class Hero
      attr_reader :name, :group, :subgroup, :games, :games_won

      def initialize(name, group, subgroup)
        @name = name
        @group = group
        @subgroup = subgroup
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
