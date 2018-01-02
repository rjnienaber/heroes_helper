const fs = require('fs');
const util = require('util');
const { TeamFitness } = require('./team_fitness');
const readFile = util.promisify(fs.readFile);
const Genetic = require('@skymaker/genetic-js')

class Solver {
  constructor(data, draftInfo) {
    this.data = data;
    this.draftInfo = draftInfo;

    // make it easy on ourselves for the moment
    let unusable = ['Cho', 'Gall']
    unusable = unusable.concat(draftInfo.ourBans).concat(draftInfo.ourTeam).concat(draftInfo.theirBans).concat(draftInfo.theirTeam);
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

      if (new Set(seed).size === seed.length)
        return seed;
    }
  }

  crossover(mother, father) {
    // two-point crossover
    const startPoint = this.draftInfo.ourTeam.length;
    const length = mother.length - startPoint;
    if (length === 0) {
      // no more slots to pick
      return [mother, father];
    }

    let son = mother.slice(0, startPoint);
    let daughter = father.slice(0, startPoint);

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

        // console.log(`firstPoint: ${firstPoint}`)
        // console.log(`secondPoint: ${secondPoint}`)
        // console.log(`father: ${father}`)
        // console.log(`mother: ${mother}`)
        // console.log(`son: ${son}`)
        // console.log(`daughter: ${daughter}`)
        // process.exit()
  
      if (new Set(son).size === length && new Set(daughter).size === length) {
        return [son, daughter];
      }
    }
  }

  randomHero() {
    const hero = Math.floor(Math.random() * this.heroes.length);
    return this.heroes[hero];
  }
}

async function main() {
  try {
    const json = await readFile('../collation/stats.json');
    const data = JSON.parse(json.toString('utf-8'));
    const draftInfo = {
      map: 'Haunted Mines',
      ourTeam: [],
      ourBans: ['Jaina'],
      theirTeam: [],
      theirBans: ['Arthas', 'Brightwing']
    };

    let bestResult;
    let lastChange = 0;
    while (lastChange !== 20) {
      const solver = new Solver(data, draftInfo);
      const result = await solver.solve();
      if (!bestResult || bestResult.fitness < result.fitness) {
        const composition = result.team.map((e) => data[e].role);
        console.log(`${result.team.join(', ')} - ${composition.join(', ')} - fitness: ${result.fitness.toFixed(2)} (${result.generation})`);        
        lastChange = 0;
        bestResult = result;
      }
      lastChange += 1;
    }



    // console.log('Press any key to exit');
    // process.stdin.setRawMode(true);
    // process.stdin.resume();
    // process.stdin.on('data', process.exit.bind(process, 0));
  } catch (err) {
    console.log(err);  
  }
}

main();
