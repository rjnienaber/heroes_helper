import uniq from 'lodash/uniq';
import flatten  from 'lodash/flatten';
import Tiers from './tiers';
import { default as data } from '../../stats.json';

export function load() {
  data.tiers = Tiers.all;
  const hero_stats = data.heroes;
  const heroes = Object.keys(hero_stats);
  const maps = uniq(flatten(heroes.map((h) => hero_stats[h].maps.strong.concat(hero_stats[h].maps.average).concat(hero_stats[h].maps.weak)))).sort();

  return {
    heroes, maps,
    rawData: data
  };
};