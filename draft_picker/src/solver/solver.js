import sample from 'lodash/sample';
import intersection from 'lodash/intersection';
import { compositionSorter } from './composition_sorter';
import { precalculateCompositions, precalculateHero } from './precalculators';

export default class Solver {
  constructor(data, draftInfo, Genetic, settings) {
    const {heroPool, ratios} = settings;
    const genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Maximize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.draftInfo = draftInfo;
    genetic.data = precalculateHero(data, draftInfo, ratios);
    genetic.TEAM_SIZE = 5;
    genetic.acceptableCompositions = precalculateCompositions(data, draftInfo);

    const unusable = draftInfo.unavailable.concat(draftInfo.blueTeam, draftInfo.redTeam);
    genetic.heroes = [];

    for (const hero in data.heroes) {
      if (!unusable.includes(hero)) {
        genetic.heroes.push(hero);
      }
    }

    genetic.seed = () => {
      if (genetic.draftInfo.blueTeam.length >= genetic.TEAM_SIZE)
        return genetic.draftInfo.blueTeam;

      let counter = 0;
      while (true) {
        let playerIndex = genetic.draftInfo.blueTeam.length === 0 ? 0 : genetic.draftInfo.blueTeam.length - 1;
        const seed = genetic.draftInfo.blueTeam.slice(0);

        while (seed.length < genetic.TEAM_SIZE) {
          const availableHeroes = intersection(heroPool[playerIndex] || [], genetic.heroes);

          seed.push(sample(availableHeroes.length === 0 ? genetic.heroes : availableHeroes));
          playerIndex +=1;
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
        score += 100 * ratios.composition;
      else if (genetic.isAcceptableComposition(entity))
        score += 50 * ratios.composition;

      score += entity.reduce((sum, e) => sum + genetic.data[e].preCalculated, 0) / genetic.TEAM_SIZE;

      // calculate synergies
      const synergies = new Set();
      entity.forEach(e => genetic.data[e].synergies.forEach(s => synergies.add(s)));
      score += entity.reduce((sum, hero) => sum + (synergies.has(hero) ? 30 : 0), 0) * ratios.synergies;

      // calculate opposing team counters
      const theirCounters = new Set();
      entity.forEach(e => genetic.data[e].countered_by.forEach(s => theirCounters.add(s)));
      score += genetic.draftInfo.redTeam.reduce((sum, hero) => sum + (theirCounters.has(hero) ? -30 : 0), 0) * ratios.counters;

      // calculate our team counters to opposing team
      const ourCounters = new Set();      
      genetic.draftInfo.redTeam.forEach(e => genetic.data[e].countered_by.forEach(s => ourCounters.add(s)));
      score += entity.reduce((sum, hero) => sum + (ourCounters.has(hero) ? 30 : 0), 0) * ratios.opposingCounters;

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

        son = Array.from(new Set(son));
        daughter = Array.from(new Set(daughter));

        if (son.length === genetic.TEAM_SIZE && daughter.length === genetic.TEAM_SIZE) {
          // double check against hero pools
          let crossOverGood = true;
          if (son.every((_, i) => heroPool[i] && heroPool[i].includes(son[i]) && heroPool[i].includes(daughter[i]))) {
            return [son, daughter];
          }
        }
      }
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
            team: pop[0].entity.sort((a, b) => compositionSorter(a, b, data)),
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
