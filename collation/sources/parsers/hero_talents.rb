require 'json'
require_relative 'hero'

module Sources
  module Parsers
    class HeroTalents
      def parse(filepath)
        heroes = {}

        Dir["#{filepath}/hero/*.json"].each do |file|
          contents = ::JSON.parse(File.read(file))
          name, group, subgroup, damage = contents.values_at('name', 'role', 'expandedRole', 'type')
          heroes[name] = Hero.new(name, group, subgroup, damage)
        end

        heroes
      end
    end
  end
end
