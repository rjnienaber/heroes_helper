require 'csv'

module Sources
  module HotsLogsExport
    class Parser
      attr_reader :hero_and_map_id_path, :replay_characters_path, :replays_path

      def initialize(export_path)
        @export_path = export_path
        @hero_and_map_id_path = File.join(export_path, 'HeroIDAndMapID.csv')
        @replay_characters_path = File.join(export_path, 'ReplayCharacters.csv')
        @replays_path = File.join(export_path, 'Replays.csv')
      end

      def parse
        raise 'Hero and Map ID file is missing' unless File.exist?(hero_and_map_id_path)
        raise 'Replay Characters file is missing' unless File.exist?(replay_characters_path)
        raise 'Replays file is missing' unless File.exist?(replays_path)

        hero_lookup, map_lookup = read_hero_and_map_ids
        replays, map_total_games = read_replays

        replay_processor = ReplayProcessor.new(hero_lookup, map_lookup, replays)
        read_replay_heroes(replay_processor)
        [map_lookup, map_total_games, replay_processor.composition_stats]
      end

      private
      def read_hero_and_map_ids
        hero_lookup = []
        map_lookup = {}
        CSV.foreach(hero_and_map_id_path, headers: true) do |row|
          if row['ID'].to_i < 1000
            hero_lookup << Hero.new(row['Name'], row['Group'], row['SubGroup'])
          else
            map_lookup[row['ID'].to_i] = row['Name']
          end
        end
        puts "HotsLogsExport: Read hero and map ids"
        [hero_lookup, map_lookup]
      end

      def read_file(file)
        skipped_header = false
        CSV.foreach(file) do |row|
          unless skipped_header
            skipped_header = true
            next
          end
          yield row
        end
      end

      def read_replays
        puts "HotsLogsExport: Reading replays..."
        replays = {}
        map_total_games = Hash.new { 0 }
        read_file(replays_path) do |replays_row|
          replay_id, game_mode, map_id, replay_length, timestamp = replays_row

          map_id = map_id.to_i
          map_total_games[map_id] += 1

          replay_id = replay_id.to_i
          replays[replay_id] = {
              replay_id: replay_id,
              game_mode: game_mode.to_i,
              map_id: map_id
          }
        end
        [replays, map_total_games]
      end

      def read_replay_heroes(replay_processor)
        puts "HotsLogsExport: Reading replay heroes..."

        read_file(replay_characters_path) do |replay_character_row|
          replay_id, _, hero_id, _, is_winner = replay_character_row
          replay_processor.process(replay_id.to_i, hero_id.to_i, is_winner.to_i == 1)
        end
      end
    end
  end
end
