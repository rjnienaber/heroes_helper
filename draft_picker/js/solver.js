const acceptableCompositions = [
  ['Assassin', 'Specialist', 'Support', 'Warrior', 'Warrior'],
  ['Assassin', 'Assassin', 'Specialist', 'Support', 'Warrior'],
  ['Assassin', 'Assassin', 'Support', 'Warrior', 'Warrior'],
  ['Assassin', 'Assassin', 'Assassin', 'Support', 'Warrior']
  // ['Assassin', 'Assassin', 'Support', 'Support', 'Warrior']
];

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

function precalculate(data, draftInfo) {
  const newData = {};
  let minWinPercent = 100;
  let maxWinPercent = 0;

  for (const hero in data) {
    const d = data[hero];
    minWinPercent = Math.min(minWinPercent, d.win_percent);
    maxWinPercent = Math.max(maxWinPercent, d.win_percent);        
  }

  const winMultiplier = maxWinPercent - minWinPercent;

  for (const hero in data) {
    const d = data[hero];
    const tiers = grubbyTiers[d.grubby_tier] + icyVeinsTiers[d.icy_veins_tier] + tenTonTiers[d.ten_ton_tier]
    let map = 0;
    if (d.maps.strong.includes(draftInfo.map)) {
      map += 50;
    } else if (d.maps.weak.includes(draftInfo.map)) {
      map -=50;
    } 

    newData[hero] = {
      tiers: tiers / 3,
      win_percent: ((d.win_percent - minWinPercent) / winMultiplier) * 100,
      map
    }
  };

  return newData;
}

// var Solver = Solver || (function () {
//   'use strict'



//   return {
//     'create': function () {
//       return new Solver()
//     },
//   }
// })()

// // so we don't have to build to run in the browser
// if (typeof module !== 'undefined') {
//   module.exports = Solver
// }


class Solver {
  constructor(data, draftInfo, Genetic) {
    const genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.draftInfo = draftInfo;
    genetic.rawData = data;
    genetic.data = precalculate(data, draftInfo);
    genetic.TEAM_SIZE = 5;
    genetic.acceptableCompositions = acceptableCompositions;

    let unavailable = [
      draftInfo.unavailable,
      draftInfo.ourBans,
      draftInfo.ourTeam,
      draftInfo.theirBans, 
      draftInfo.theirTeam
    ];

    const unusable = unavailable.reduce((sum, v) => sum.concat(v), []);
    genetic.heroes = [];
    for (const hero in data) {
      if (!unusable.includes(hero)) {
        genetic.heroes.push(hero);
      }
    }

    genetic.seed = () => {
      while (true) {
        const seed = genetic.draftInfo.ourTeam.slice(0);
        while (seed.length < 5) {
          seed.push(genetic.randomHero());
        }

        if (new Set(seed).size === genetic.TEAM_SIZE)
          return seed;
      }
    };

    genetic.fitness = (entity) => {
      const composition = entity.map((e) => genetic.rawData[e].role).sort();
      const hasAcceptableComposition = genetic.acceptableCompositions.some(c => composition.every((v, i) => v === c[i]))    
      let score = hasAcceptableComposition ? 50 : -50;

      score += entity.reduce((sum, e) => sum + genetic.data[e].tiers, 0) / 5;
      score += entity.reduce((sum, e) => sum + genetic.data[e].win_percent, 0) / 5;
      score += entity.reduce((sum, e) => sum + genetic.data[e].map, 0) / 5;

      // calculate synergies
      const synergies = new Set();
      entity.forEach(e => genetic.rawData[e].synergies.forEach(s => synergies.add(s)));
      score += entity.reduce((sum, hero) => sum + (synergies.has(hero) ? 30 : 0), 0);

      // calculate opposing team counters
      const theirCounters = new Set();
      entity.forEach(e => genetic.rawData[e].counters.forEach(s => theirCounters.add(s)));
      score += genetic.draftInfo.theirTeam.reduce((sum, hero) => sum + (theirCounters.has(hero) ? -30 : 0), 0);

      // calculate our team counters to opposing team
      const ourCounters = new Set();
      genetic.draftInfo.theirTeam.forEach(e => genetic.rawData[e].counters.forEach(s => ourCounters.add(s)));
      score += entity.reduce((sum, hero) => sum + (ourCounters.has(hero) ? 30 : 0), 0);

      return score;
    };

    genetic.crossover = (mother, father) => {
      // start trying to do two-point crossover
      const startPoint = genetic.draftInfo.ourTeam.length;
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

  solve() {
    const config = {
      maxResults: 1,
      iterations: 40,
      webWorkers: false,
    };

    return new Promise((resolve, reject) => {
      this.genetic.notification = (pop, generation, stats, isFinished) => {
        if (isFinished) {
          const result = {
            team: pop[0].entity.sort(),
            fitness: pop[0].fitness,
            generation
          }

          resolve(result);
        }
      };

      this.genetic.evolve(config, {});
    });
  }
}

// module.exports = Solver;
