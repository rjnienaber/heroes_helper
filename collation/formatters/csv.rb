module Formatters
  class CSV
    attr_reader :output_file

    def initialize(output_file)
      @output_file = output_file
    end

    def format(data)
      stats = data.keys.sort.map do |hero|
        hero_stats = data[hero]
        [hero, hero_stats[:win_percent], hero_stats[:role], hero_stats[:subrole], hero_stats[:icy_veins_tier],
          hero_stats[:ten_ton_tier], hero_stats[:difficulty], hero_stats[:gems], hero_stats[:gold], hero_stats[:description]]
      end

      ::CSV.open(output_file, "w") do |csv|
        csv << ["hero", "win_percent", "role", "subrole", "icy_veins_tier", "ten_ton_tier", "difficulty", "gem_cost", "gold_cost", "description"]
        stats.each do |stat|
          csv << stat
        end
      end
    end
  end
end