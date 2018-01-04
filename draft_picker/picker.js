const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Genetic = require('./js/genetic.js')
const Solver = require('./js/solver');

async function main() {
  try {
    const json = await readFile('../collation/stats.json');
    const data = JSON.parse(json.toString('utf-8'));
    const draftInfo = {
      map: 'Battlefield of Eternity',
      unavailable: [],
      ourTeam: [],
      ourBans: [],
      theirTeam: [],
      theirBans: []
    };


    let bestResult;
    let lastChange = 0;
    while (lastChange !== 20) {
      const solver = new Solver(data, draftInfo, Genetic);
      const result = await solver.solve();
      if (!bestResult || bestResult.fitness < result.fitness) {
        const composition = result.team.map((e) => data[e].role);
        console.log(`${result.team.join(', ')} - ${composition.join(', ')} - fitness: ${result.fitness.toFixed(2)} (${result.generation})`);        
        lastChange = 0;
        bestResult = result;
      }
      lastChange += 1;
    }

    console.log(`Finished: ${new Date().toISOString()}`)
  } catch (err) {
    console.log(err);  
  }
}

main();
