#!/usr/bin/env ruby

require_relative 'sources/all'
require_relative 'formatters/all'
require 'csv'
require 'yaml'
require 'json'

browser = Sources::Browser.new('./cache')
icy_veins_builds = Sources::IcyVeinsBuilds.new(browser)
maps = Sources::Maps.new(browser, icy_veins_builds)
synergies_counters = Sources::SynergiesCounters.new(browser, icy_veins_builds)
prices = Sources::Prices.new(browser)
subroles = Sources::SubRoles.new(browser)
p subroles.values
roles = Sources::Roles.new(browser)
ten_ton_tiers = Sources::TenTonTiers.new(browser)
grubby_tiers = Sources::GrubbyTiers.new(browser)
icy_veins_tiers = Sources::IcyVeinsTiers.new(browser)
win_percent_plugin = Sources::WinPercent.new(browser)
map_compositions = Sources::MapCompositions.new(browser)

heroes = (win_percent_plugin.heroes + 
          subroles.heroes + 
          prices.heroes + 
          ten_ton_tiers.heroes + 
          grubby_tiers.heroes + 
          icy_veins_tiers.heroes + 
          icy_veins_builds.heroes)
heroes = heroes.uniq.sort

# collate sources
hero_stats = Hash[heroes.map do |hero|
  win_percent = win_percent_plugin[hero]
  gems_and_gold = prices[hero]
  role = roles[hero]
  subrole = subroles[hero]
  tier_and_difficulty = ten_ton_tiers[hero]
  grubby_tier = grubby_tiers[hero]
  icy_veins_tier = icy_veins_tiers[hero]
  map_performance = maps[hero]
  hero_synergies_counters = synergies_counters[hero]

  # check all stats for the hero are there
  unless win_percent && gems_and_gold && role && subrole && tier_and_difficulty && grubby_tier && icy_veins_tier && map_performance && hero_synergies_counters
    puts "No win percent for #{hero}" unless win_percent
    puts "No gems and gold cost for #{hero}" unless gems_and_gold
    puts "No role for #{hero}" unless role
    puts "No subrole for #{hero}" unless subrole
    puts "No tier and difficulty for #{hero}" unless tier_and_difficulty
    puts "No Grubby tier for #{hero}" unless grubby_tier
    puts "No Icy Veins tier for #{hero}" unless icy_veins_tier
    puts "No Icy Veins Synergies/Counters for #{hero}" unless hero_synergies_counters
    puts "No Icy Veins Map Performance for #{hero}" unless map_performance
    exit
  end

  # check counter/synergy heros
  unknown_heroes = (hero_synergies_counters[:counters] + hero_synergies_counters[:synergies]) - heroes
  puts "Unknown heroes in synergies/counters: #{unknown_heroes}" if unknown_heroes.length != 0

  gems, gold = gems_and_gold
  ten_ton_tier, difficulty, description = tier_and_difficulty
  all_stats = {
    win_percent: win_percent.to_f,
    role: role,
    subrole: subrole,
    grubby_tier: grubby_tier,
    icy_veins_tier: icy_veins_tier,
    ten_ton_tier: ten_ton_tier,
    difficulty: difficulty,
    gems: gems,
    gold: gold,
    description: description,
  }.merge(hero_synergies_counters).merge(maps: map_performance)

  [hero, all_stats]
end]

stats = {heroes: hero_stats, map_stats: map_compositions.values}

# output formats
Formatters::Yaml.new('stats.yml').format(stats)
Formatters::CSV.new('stats.csv').format(hero_stats)
Formatters::Json.new('stats.json').format(stats)


