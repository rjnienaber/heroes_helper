const Genetic = require('@skymaker/genetic-js')
const { TeamFitness } = require('./team_fitness');

const TEAM_SIZE = 5;

class Solver {
  constructor(data, draftInfo) {
    this.data = data;
    this.draftInfo = draftInfo;

    let unavailable = [
      draftInfo.unavailable,
      draftInfo.ourBans,
      draftInfo.ourTeam,
      draftInfo.theirBans, 
      draftInfo.theirTeam
    ];

    const unusable = unavailable.reduce((sum, v) => sum.concat(v), []);
    this.heroes = Object.keys(this.data).filter(k => !unusable.includes(k));

    this.genetic = Genetic.create();
    this.genetic.optimize = Genetic.Optimize.Maximize;
    this.genetic.select1 = Genetic.Select1.Tournament2;
    this.genetic.select2 = Genetic.Select2.Tournament2;

    this.genetic.seed = this.seed.bind(this);

    const fitness = new TeamFitness(data, draftInfo);
    this.genetic.fitness = fitness.fitness.bind(fitness);
    this.genetic.crossover = this.crossover.bind(this);
  }

  solve() {
    const config = {
      maxResults: 1,
      iterations: 40
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

  seed() {
    while (true) {
      const seed = this.draftInfo.ourTeam.slice(0);
      while (seed.length < 5) {
        seed.push(this.randomHero());
      }

      if (new Set(seed).size === TEAM_SIZE)
        return seed;
    }
  }

  crossover(mother, father) {
    // start trying to do two-point crossover
    const startPoint = this.draftInfo.ourTeam.length;
    const length = mother.length - startPoint;
    if (length === 0) {
      // no more slots to pick
      return [mother, father];
    }

    let son = mother.slice(0, startPoint);
    let daughter = father.slice(0, startPoint);

    if (length === 1) {
      // switch to single point crossover
      son = son.concat([father[TEAM_SIZE - 1]])
      daughter = daughter.concat([mother[TEAM_SIZE - 1]])

      if (new Set(son).size === TEAM_SIZE && new Set(daughter).size === TEAM_SIZE) {
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


      if (new Set(son).size === TEAM_SIZE && 
          new Set(daughter).size === TEAM_SIZE && 
          son.length === TEAM_SIZE &&
          daughter.length === TEAM_SIZE) {
        return [son, daughter];
      }
    }
  }

  randomHero() {
    const hero = Math.floor(Math.random() * this.heroes.length);
    return this.heroes[hero];
  }
}

module.exports = {
  Solver: Solver,
};
