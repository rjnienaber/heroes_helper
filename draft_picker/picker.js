import fs from 'fs'
import util from 'util'
import Genetic from '@skymaker/genetic-js'
import Solver from './src/solver/solver'
import Tiers from './src/solver/tiers'
import Explainer from './src/solver/explainer'

const readFile = util.promisify(fs.readFile);

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
  bestResult.elapsed = (new Date() - startTime) / 1000;

  return bestResult;
}

async function main() {
  try {
    const json = await readFile('stats.json');
    const data = JSON.parse(json.toString('utf-8'));
    data.tiers = Tiers.all;

    const draftInfo = {
      map: 'Volskaya Foundry',
      unavailable: [''],
      redTeam: ['Malfurion', 'Genji', 'Chromie', 'Diablo', 'Johanna'],
      redTeamBans: ['Stukov', 'Medivh'],
      blueTeam: ['Hanzo', 'Garrosh', 'Zeratul', 'Thrall'],
      blueTeamBans: ['Maiev', 'Tyrael']
    };

    const result = await runSolver(data, draftInfo, {}, 10);
    const composition = result.team.map((e) => data.heroes[e].role);
    console.log(`${result.team.join(', ')} - ${composition.join(', ')} - fitness: ${result.fitness.toFixed(2)} (${result.generation})`);        

    console.log('Composition Explained:');
    draftInfo.blueTeam = result.team;
    const explainer = new Explainer(data, draftInfo);
    for (const hero of result.team) {
      const explained = explainer.explainHero(hero);
      console.log(`Hero: ${hero}`);
      if (explained.over50WinPercent)
        console.log('  Over 50 percent win rate');
      if (explained.strongMap)
        console.log(`  Strong on ${draftInfo.map}`);
      if (explained.synergies.length > 0)
        console.log(`  Synergies: ${explained.synergies.join(', ')}`);
      if (explained.counters.length > 0)
        console.log(`  Counters: ${explained.counters.join(', ')}`);
      if (explained.topTwoGrubbyTiers)
        console.log(`  Appears in top two Grubby Tier`);
      if (explained.topTwoTenTonTiers)
        console.log(`  Appears in top two Ten Ton Tier`);
      if (explained.topTwoIcyVeinsTiers)
        console.log(`  Appears in top two Icy Veins Tier`);
    }

  } catch (err) {
    console.log(err);  
  }
}

main();
