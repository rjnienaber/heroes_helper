function precalculateCompositions(data, draftInfo) {
  let mapStats = data.map_stats[draftInfo.map];
  if (!mapStats)
    mapStats = data.map_stats['All Maps'];

  return mapStats.map((s) => s.roles.sort());
}

function precalculateHero(data, draftInfo) {
  const newData = {};
  let minWinPercent = 100;
  let maxWinPercent = 0;

  for (const hero in data.heroes) {
    const d = data.heroes[hero];
    minWinPercent = Math.min(minWinPercent, d.win_percent);
    maxWinPercent = Math.max(maxWinPercent, d.win_percent);        
  }

  const winMultiplier = maxWinPercent - minWinPercent;
  const { icyVeins, tenTon } = data.tiers;

  for (const hero of Object.keys(data.heroes)) {
    const d = data.heroes[hero];
    let preCalculated = 0;

    preCalculated = (icyVeins[d.icy_veins_tier] + tenTon[d.ten_ton_tier]) / 2;

    preCalculated += ((d.win_percent - minWinPercent) / winMultiplier) * 100;

    if (d.maps.strong.includes(draftInfo.map)) {
      preCalculated += 50;
    } else if (d.maps.weak.includes(draftInfo.map)) {
      preCalculated -=50;
    } 

    if (Number.isNaN(preCalculated)) {
      console.log(`NaN precalculated for ${hero}`);
      console.log(`Icy Veins tier: ${icyVeins[d.icy_veins_tier]}`);
      console.log(`Ten Ton tier: ${tenTon[d.ten_ton_tier]}`);
      console.log(`Win Percent: ${d.win_percent}`);
      console.log(d);
      process.exit(1)
    }

    newData[hero] = {
      preCalculated,
      role: d.role,
      subrole: d.subrole,
      synergies: d.synergies,
      countered_by: d.countered_by
    }
  };

  return newData;
}

export default class Solver {
  constructor(data, draftInfo, Genetic) {
    const genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.draftInfo = draftInfo;
    genetic.data = precalculateHero(data, draftInfo);
    genetic.TEAM_SIZE = 5;
    genetic.acceptableCompositions = precalculateCompositions(data, draftInfo);

    let unavailable = [ draftInfo.unavailable, draftInfo.blueTeam, draftInfo.redTeam ];
    const unusable = unavailable.reduce((sum, v) => sum.concat(v), []);
    genetic.heroes = [];
    for (const hero in data.heroes) {
      if (!unusable.includes(hero)) {
        genetic.heroes.push(hero);
      }
    }

    genetic.seed = () => {
      if (genetic.draftInfo.blueTeam.length >= 5)
        return genetic.draftInfo.blueTeam;

      let counter = 0;
      while (true) {
        const seed = genetic.draftInfo.blueTeam.slice(0);

        while (seed.length < 5) {
          seed.push(genetic.randomHero());
        }

        if (new Set(seed).size === genetic.TEAM_SIZE) {
          counter += 1;
          if (genetic.isAcceptableComposition(seed) || counter > 50)
            return seed;
        }
      }
    };

    genetic.isGoodComposition = (entity) => {
      const composition = entity.map((e) => genetic.data[e].subrole).sort();
      return genetic.acceptableCompositions.some(c => composition.every((v, i) => v === c[i]))    
    };

    genetic.isAcceptableComposition = (entity) => {
      const roles = new Set(entity.map((e) => genetic.data[e].role));
      return roles.has('Warrior') && roles.has('Assassin') && roles.has('Support')
    };

    genetic.myCache = {};
    genetic.fitness = (entity) => {
      let score = genetic.myCache[entity.sort()] || 0;
      if (score !== 0)
        return score;

      if (genetic.isGoodComposition(entity))
        score += 100;
      else if (genetic.isAcceptableComposition(entity))
        score += 50;

      score += entity.reduce((sum, e) => sum + genetic.data[e].preCalculated, 0) / 5;

      // calculate synergies
      const synergies = new Set();
      entity.forEach(e => genetic.data[e].synergies.forEach(s => synergies.add(s)));
      score += entity.reduce((sum, hero) => sum + (synergies.has(hero) ? 30 : 0), 0);

      // calculate opposing team counters
      const theirCounters = new Set();
      entity.forEach(e => genetic.data[e].countered_by.forEach(s => theirCounters.add(s)));
      score += genetic.draftInfo.redTeam.reduce((sum, hero) => sum + (theirCounters.has(hero) ? -30 : 0), 0);

      // calculate our team counters to opposing team
      const ourCounters = new Set();      
      genetic.draftInfo.redTeam.forEach(e => genetic.data[e].countered_by.forEach(s => ourCounters.add(s)));
      score += entity.reduce((sum, hero) => sum + (ourCounters.has(hero) ? 30 : 0), 0);

      genetic.myCache[entity.sort()] = score;
      return score;
    };

    genetic.crossover = (mother, father) => {
      // start trying to do two-point crossover
      const startPoint = genetic.draftInfo.blueTeam.length;
      const length = mother.length - startPoint;
      if (length === 0) {
        // no more slots to pick
        return [mother, father];
      }

      let son = mother.slice(0, startPoint);
      let daughter = father.slice(0, startPoint);

      if (length === 1) {
        // switch to single point crossover
        son = son.concat([father[genetic.TEAM_SIZE - 1]]);
        daughter = daughter.concat([mother[genetic.TEAM_SIZE - 1]]);

        if (new Set(son).size === genetic.TEAM_SIZE && new Set(daughter).size === genetic.TEAM_SIZE) {
          return [son, daughter];
        } else {
          return [mother, father];
        }
      }

      let outerCounter = 0;
      while (true) {
        outerCounter += 1;
        if (outerCounter === 10) {
          //too similar so no point in crossing over
          return [mother, father];
        }

        let firstPoint = 0;
        let secondPoint = 0;
        while (firstPoint === secondPoint || firstPoint >= secondPoint) {
          firstPoint = Math.floor(Math.random() * length);
          secondPoint = Math.floor(Math.random() * length);           
        }

        firstPoint += startPoint; 
        secondPoint += startPoint + 1; 

        son = son.concat(father.slice(startPoint, firstPoint)).concat(mother.slice(firstPoint, secondPoint)).concat(father.slice(secondPoint, length));
        daughter = daughter.concat(mother.slice(startPoint, firstPoint)).concat(father.slice(firstPoint, secondPoint)).concat(mother.slice(secondPoint, length));


        if (new Set(son).size === genetic.TEAM_SIZE && 
            new Set(daughter).size === genetic.TEAM_SIZE && 
            son.length === genetic.TEAM_SIZE &&
            daughter.length === genetic.TEAM_SIZE) {
          return [son, daughter];
        }
      }
    };

    genetic.randomHero = () => {
      const hero = Math.floor(Math.random() * genetic.heroes.length);
      return genetic.heroes[hero];
    };

    this.genetic = genetic;
  }

  solve(config) {
    const defaultConfig = {
      size: 275,
      crossover: 1.0,
      maxResults: 1,
      iterations: 25,
      webWorkers: false
    };

    const conf = Object.assign({}, defaultConfig, config);

    const data = this.genetic.data;

    return new Promise((resolve, reject) => {
      this.genetic.notification = (pop, generation, stats, isFinished) => {
        if (isFinished) {
            const result = {
            team: pop[0].entity.sort((a,b) => {
              const roleA = data[a].role;
              const roleB = data[b].role;
              if (roleA === roleB) {
                if (a === b) {
                  return 0;
                } else {
                  return a > b ? 1 : -1
                }
              }

              if (roleA === 'Warrior')
                return -1;
              else if (roleB === 'Warrior')
                return 1;

              if (roleA === 'Assassin')
                return -1;
              else if (roleB === 'Assassin')
                return 1;

              if (roleA === 'Specialist')
                return -1;
              else if (roleB === 'Specialist')
                return 1;

              if (roleA === 'Multiclass')
                return -1;
              else if (roleB === 'Multiclass')
                return 1;

              if (roleA === 'Support')
                return -1;
              else if (roleB === 'Support')
                return 1;

            }),
            fitness: pop[0].fitness,
            generation
          };
         resolve(result);
        }
      };

      this.genetic.evolve(conf, {});
    });
  }
}
