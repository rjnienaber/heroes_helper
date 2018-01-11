const grubbyTiers = {
  'S Tier': 100, 
  'T1 Tier': 66, 
  'T2 Tier': 33, 
  'T3 Tier': 0
}

const icyVeinsTiers = {
  'Prime Tier': 100,
  'Core Tier': 66,
  'Viable Tier': 33,
  'Niche Tier': 33,
  'Bottom Tier': 0
}

const tenTonTiers = {
  'S+ Tier': 100,
  'S Tier': 83, 
  'A+ Tier': 66, 
  'A Tier': 49, 
  'B+ Tier': 32, 
  'B Tier': 16, 
}

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

  for (const hero in data.heroes) {
    const d = data.heroes[hero];
    let preCalculated = 0;
    preCalculated = (grubbyTiers[d.grubby_tier] + icyVeinsTiers[d.icy_veins_tier] + tenTonTiers[d.ten_ton_tier]) / 3;
    preCalculated += ((d.win_percent - minWinPercent) / winMultiplier) * 100;

    let map = 0;
    if (d.maps.strong.includes(draftInfo.map)) {
      preCalculated += 50;
    } else if (d.maps.weak.includes(draftInfo.map)) {
      preCalculated -=50;
    } 

    newData[hero] = {
      preCalculated,
      role: d.role,
      subrole: d.subrole,
      synergies: d.synergies,
      counters: d.counters
    }
  };

  return newData;
}

class Solver {
  constructor(data, draftInfo, Genetic) {
    const genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.draftInfo = draftInfo;
    genetic.data = precalculateHero(data, draftInfo);
    genetic.TEAM_SIZE = 5;
    genetic.acceptableCompositions = precalculateCompositions(data, draftInfo);

    let unavailable = [
      draftInfo.unavailable,
      draftInfo.blueTeamBans,
      draftInfo.blueTeam,
      draftInfo.redTeamBans, 
      draftInfo.redTeam
    ];

    const unusable = unavailable.reduce((sum, v) => sum.concat(v), []);
    genetic.heroes = [];
    for (const hero in data.heroes) {
      if (!unusable.includes(hero)) {
        genetic.heroes.push(hero);
      }
    }

    genetic.seed = () => {
      while (true) {
        const seed = genetic.draftInfo.blueTeam.slice(0);
        while (seed.length < 5) {
          seed.push(genetic.randomHero());
        }

        if (new Set(seed).size === genetic.TEAM_SIZE)
          return seed;
      }
    };

    genetic.isAcceptableComposition = (entity) => {
      const composition = entity.map((e) => genetic.data[e].subrole).sort();
      return genetic.acceptableCompositions.some(c => composition.every((v, i) => v === c[i]))    
    }

    genetic.myCache = {}
    genetic.fitness = (entity) => {
      let score = genetic.myCache[entity.sort()] || 0;
      if (score !== 0)
        return score;

      score += genetic.isAcceptableComposition(entity) ? 100 : 0;

      score += entity.reduce((sum, e) => sum + genetic.data[e].preCalculated, 0) / 5;

      // calculate synergies
      const synergies = new Set();
      entity.forEach(e => genetic.data[e].synergies.forEach(s => synergies.add(s)));
      score += entity.reduce((sum, hero) => sum + (synergies.has(hero) ? 30 : 0), 0);

      // calculate opposing team counters
      const theirCounters = new Set();
      entity.forEach(e => genetic.data[e].counters.forEach(s => theirCounters.add(s)));
      score += genetic.draftInfo.redTeam.reduce((sum, hero) => sum + (theirCounters.has(hero) ? -30 : 0), 0);

      // calculate our team counters to opposing team
      const ourCounters = new Set();      
      genetic.draftInfo.redTeam.forEach(e => genetic.data[e].counters.forEach(s => ourCounters.add(s)));
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
        son = son.concat([father[genetic.TEAM_SIZE - 1]])
        daughter = daughter.concat([mother[genetic.TEAM_SIZE - 1]])

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
    };

    const conf = Object.assign({}, defaultConfig, config)

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

              if (roleA === 'Support')
                return -1;
              else if (roleB === 'Support')
                return 1;

            }),
            fitness: pop[0].fitness,
            generation
          }
         resolve(result);
        }
      };

      this.genetic.evolve(conf, {});
    });
  }
}

// so we don't have to build to run in the browser
if (typeof module !== 'undefined') {
  module.exports = Solver
}