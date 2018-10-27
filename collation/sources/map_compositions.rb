module Sources
  class MapCompositions
    attr_reader :cache_dir, :export_path

    def initialize(cache_dir, export_path)
      @cache_dir = File.absolute_path(cache_dir)
      @export_path = export_path
    end

    def values
      map_values = retrieve_values
      map_total_games = Hash[map_values.map { |map, stats| [map, stats.sum { |s| s['count'] }] }]

      map_values.each do |map, stats|
        map_values[map] = stats.select { |s| s['win_percent'] >= 50 && s['count'] >= (map_total_games[map] * 0.01) }
      end

      map_values
    end

    private
    def retrieve_values
      file_name = "#{cache_dir}/parsed_map_compositions.json"

      unless File.exist?(file_name)
        parser = HotsLogsExport::Parser.new(export_path)
        map_lookup, _, composition_stats = parser.parse
        grouped_composition_stats = composition_stats.values.group_by {|c| c.map_id}

        map_values = {}
        grouped_composition_stats.each do |map_id, stats|
          map = map_lookup[map_id]
          map_values[map] = stats.map do |s|
            {count: s.games, win_percent: (s.win_percentage * 100).round(1), roles: s.subgroups}
          end
        end

        formatter = Formatters::Json.new(file_name)
        formatter.format(map_values)
      end

      ::JSON.parse(File.read(file_name))
    end
  end
end