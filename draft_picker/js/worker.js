async function runSolver(forBlueTeam, data, draftInfo) {
  let bestResult;
  let lastChange = 0;
  while (lastChange !== 20) {
    const solver = new Solver(data, draftInfo, Genetic);
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
  self.importScripts('../node_modules/@skymaker/genetic-js/genetic-js.min.js');
  self.importScripts('solver.js');

  const [data, draftInfo] = e.data;
  runSolver(true, data, draftInfo);

  const banDraftInfo = JSON.parse(JSON.stringify(draftInfo));
  Object.assign(banDraftInfo, {redTeam: banDraftInfo.blueTeam, blueTeam: banDraftInfo.redTeam});
  runSolver(false, data, banDraftInfo);
}
