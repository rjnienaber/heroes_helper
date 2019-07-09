import Genetic from '@skymaker/genetic-js';
import Solver from './solver'

async function runSolver(forBlueTeam, data, draftInfo, settings) {
  let bestResult;
  let lastChange = 0;
  while (lastChange !== 20) {
    const solver = new Solver(data, draftInfo, Genetic, settings);
    const result = await solver.solve();
    if (!bestResult || bestResult.fitness < result.fitness) {
      postMessage({result, isFinished: false, forBlueTeam});
      lastChange = 0;
      bestResult = result;
    }
    lastChange += 1;
  }
  
  postMessage({result: bestResult, isFinished: true, forBlueTeam});
}

onmessage = async (e) => {
  const [data, draftInfo, settings] = e.data;
  runSolver(true, data, draftInfo, settings);

  const banDraftInfo = JSON.parse(JSON.stringify(draftInfo));
  Object.assign(banDraftInfo, {redTeam: banDraftInfo.blueTeam, blueTeam: banDraftInfo.redTeam});
  runSolver(false, data, banDraftInfo, {ratios: settings.ratios, heroPool: []});
}
