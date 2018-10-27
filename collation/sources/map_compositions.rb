module Sources
  class MapCompositions
    attr_reader :export_path

    def initialize(export_path)
      @export_path = export_path
    end

    def values
      parser = HotsLogsExport::Parser.new(export_path)
      map_lookup, map_total_games, composition_stats = parser.parse

      grouped_composition_stats = composition_stats.values.group_by { |c| c.map_id}

      map_values = {}
      grouped_composition_stats.each do |map_id, stats|
        map = map_lookup[map_id]
        winning_stats = stats.select { |s| s.win_percentage >= 0.5 && s.games >= (map_total_games[map_id] * 0.01) }
        map_values[map] = winning_stats.map do |s|
          { count: s.games, win_percent: (s.win_percentage * 100).round(1), roles: s.subgroups }
        end
      end

      map_values
    end
  end
end