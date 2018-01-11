const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Genetic = require('@skymaker/genetic-js')
const Solver = require('./js/solver');

async function runSolver(data, draftInfo, config, repeats) {
  const startTime = new Date();
  let bestResult;
  let lastChange = 0;
  while (lastChange !== repeats) {
    const solver = new Solver(data, draftInfo, Genetic);
    const result = await solver.solve(config);
    if (!bestResult || bestResult.fitness < result.fitness) {
      lastChange = 0;
      bestResult = result;
    }
    lastChange += 1;
  }
  bestResult.elapsed = (new Date() - startTime) / 1000

  return bestResult;
}

async function main() {
  try {
    const json = await readFile('../collation/stats.json');
    const data = JSON.parse(json.toString('utf-8'));
    const draftInfo = {
      map: 'Blackheart\'s Bay',
      unavailable: [],
      blueTeam: [],
      blueTeamBans: [],
      redTeam: [],
      redTeamBans: []
    };

    const result = await runSolver(data, draftInfo, {}, 10);
    const composition = result.team.map((e) => data.heroes[e].role);
    console.log(`${result.team.join(', ')} - ${composition.join(', ')} - fitness: ${result.fitness.toFixed(2)} (${result.generation})`);        
  } catch (err) {
    console.log(err);  
  }
}

main();
