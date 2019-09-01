module Sources
  module Parsers
    class Hero
      attr_reader :name, :group, :subgroup, :damage, :games, :games_won

      def initialize(name, group, subgroup, damage)
        @name = name
        @group = group
        @subgroup = subgroup
        @damage = damage
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
