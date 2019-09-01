module Sources
  class MapCompositions
    include Common

    attr_reader :cache_dir, :export_path, :heroes_talents

    def initialize(cache_dir, export_path, heroes_talents)
      @cache_dir = File.absolute_path(cache_dir)
      @export_path = export_path
      @heroes_talents = heroes_talents
    end

    def values
      map_values, heroes = retrieve_values
      map_total_games = Hash[map_values.map { |map, stats| [map, stats.sum { |s| s['count'] }] }]

      map_values.each do |map, stats|
        map_values[map] = stats.select { |s| s['win_percent'] >= 50 && s['count'] >= (map_total_games[map] * 0.01) }
      end

      [map_values, heroes]
    end

    private
    def retrieve_values
      file_name = "#{cache_dir}/parsed_map_compositions.json"

      unless File.exist?(file_name)
        map_values, heroes = hots_api_parser(export_path)

        formatter = Formatters::Json.new(file_name)
        formatter.format({ map_values: map_values, heroes: heroes })
      end

      ::JSON.parse(File.read(file_name)).values_at('map_values', 'heroes')
    end

    def hots_logs_parser(export_path)
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

      map_values
    end

    def hots_api_parser(export_path)
      export = Sources::Parsers::HotsApiExport.new(heroes_talents)
      composition_stats, heroes = export.parse(export_path)
      grouped_composition_stats = composition_stats.values.group_by {|c| c.map_id}

      map_values = {}
      grouped_composition_stats.each do |map, stats|
        map_values[map] = stats.map do |s|
          {count: s.games, win_percent: (s.win_percentage * 100).round(1), roles: s.subgroups}
        end
      end

      [map_values, normalize_values(heroes)]
    end
  end
end