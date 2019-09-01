#!/usr/bin/env bash

SQL="SELECT r.id, r.game_map, r.players.hero, IF(r.players.winner == true, 1, 0) as result
FROM [cloud-project-179020:hotsapi.replays] r 
WHERE r.game_date > TIMESTAMP('`date +%Y-%m-%d -d "30 days ago"` 00:00:00') AND r.game_type IN ('QuickMatch', 'StormLeague', 'UnrankedDraft')
ORDER BY r.game_date, r.players.winner"

MAP_STATS_FILE=/tmp/map_results.csv
if [ ! -f "$MAP_STATS_FILE" ]; then
  bq query --max_rows 2147483647 --format csv --use_legacy_sql "$SQL" > $MAP_STATS_FILE
fi

HERO_INFO=/tmp/heroes-talents
if [ ! -d "$MAP_STATS_FILE" ]; then
  git clone --depth=1 https://github.com/heroespatchnotes/heroes-talents.git $HERO_INFO
fi
