import fs from 'fs'
import util from 'util'
import lodash from 'lodash';
import Genetic from '@skymaker/genetic-js'
import Solver from '../src/solver/solver'
import Tiers from '../src/solver/tiers'


const readFile = util.promisify(fs.readFile);

async function runSolver(data, draftInfo, config, repeats) {
  const ratios = {
    composition: 1,
    winPercent: 1,
    icyVeinsTiers: 0.5,
    tenTonTiers: 0.5,
    strongMaps: 1,
    weakMaps: 1,
    synergies: 1,
    counters: 1,
    opposingCounters: 1
  };

  const startTime = new Date();
  let bestResult;
  let lastChange = 0;
  while (lastChange !== repeats) {
    const solver = new Solver(data, draftInfo, Genetic, {ratios});
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
    const json = await readFile('./stats.json');
    const data = JSON.parse(json.toString('utf-8'));
    data.tiers = Tiers.all;

    const pools = [
      ['Fenix','Thrall','Sylvanas', 'Imperius', 'Arthas', 'Varian'],
      ['Genji','Abathur','Hanzo','Fenix','Xul','E.T.C.','Kael\'thas','Zagara'],
      ['Anduin','Alexstrasza','Stukov'],
      ['Johanna','E.T.C.','Arthas','Muradin','Diablo'],
      // ['Raynor','Jaina','Blaze','Sylvanas','Li-Ming'],
    ];

    const completePool = lodash.flatten(pools);

    const excludedRoles = ['Support', 'Warrior'];
    const healersAndTanks = Object.keys(data.heroes).filter((h) => excludedRoles.includes(data.heroes[h].role));
    const excludedHeroes = ['Cho', 'Gall'].concat(lodash.difference(healersAndTanks, completePool));

    const count = {};
    for (let i = 0; i < 1000; i++) {
      let currentExcludedHeroes = excludedHeroes.slice();
      const blueTeam = [];
      for (const pool of pools) {
        while (true) {
          const hero = lodash.sample(pool);
          if (!blueTeam.includes(hero)) {
            blueTeam.push(hero);
            break
          }
        }
      }

      currentExcludedHeroes = currentExcludedHeroes.concat(lodash.difference(completePool, blueTeam));

      let counter = 0;
      while (counter < 5) {
        const draftInfo = {
          unavailable: currentExcludedHeroes,
          blueTeam,
          redTeam: [],
        };

        const result = await runSolver(data, draftInfo, {}, 5);
        const finalHero = lodash.difference(result.team, blueTeam)[0];

        if (!(count.hasOwnProperty(finalHero))) {
          count[finalHero] = 1;
        } else {
          count[finalHero] += 1;
        }

        console.error(finalHero);
        currentExcludedHeroes.push(finalHero);
        counter += 1;
      }
      console.error(count)
    }
    lodash.sortBy(Object.entries(count), ([,v]) => v).reverse().forEach(([h, v]) => console.log(`${h} ${v}`))
  } catch (err) {
    console.error(err);
  }
}

main();
