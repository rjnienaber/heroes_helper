onmessage = async (e) => {
  self.importScripts('https://unpkg.com/@skymaker/genetic-js@0.1.15/genetic-js.min.js');
  self.importScripts('solver.js');
  const [data, draftInfo] = e.data;

  let bestResult;
  let lastChange = 0;
  while (lastChange !== 20) {
    const solver = new Solver(data, draftInfo, Genetic);
    const result = await solver.solve();
    if (!bestResult || bestResult.fitness < result.fitness) {
      postMessage({result, isFinished: false});
      lastChange = 0;
      bestResult = result;
    }
    lastChange += 1;
  }
  
  postMessage({result: bestResult, isFinished: true});
}
