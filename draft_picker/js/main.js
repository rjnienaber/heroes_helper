function loadStats() {
  return new Promise((resolve) => {
    $.getJSON('stats.json', (data) => {
      const heroes = Object.keys(data);
      const maps = _.uniq(_.flatten(heroes.map((h) => data[h].maps.strong.concat(data[h].maps.average).concat(data[h].maps.weak)))).sort();
      resolve({
        heroes, maps,
        rawData: data
      });
    });
  });
};

let initializing = true;
const cache = {};
async function runSolver() {
  if (initializing)
    return;

  const blueTeam = $('#select-blue-team')[0].selectize.items;
  const redTeam = $('#select-red-team')[0].selectize.items;

  // rename to blue team
  const draftInfo = {
    map: $('#select-map')[0].selectize.items[0],
    unavailable: $('#select-exclude')[0].selectize.items,
    blueTeam,
    blueTeamBans: $('#select-blue-bans')[0].selectize.items,
    redTeam,
    redTeamBans: $('#select-red-bans')[0].selectize.items
  };

  const suggestedPicks = $('#suggested-picks');
  suggestedPicks.text('Searching...');
  $('#calculating-team').show();

  const suggestedBans = $('#suggested-bans');
  suggestedBans.text('Searching...');
  $('#calculating-bans').show();

  if (cache.worker)
    cache.worker.terminate();
  cache.worker = new Worker('js/worker.js');

  cache.worker.onmessage = function(e) {
    const {result, isFinished, forBlueTeam} = e.data;
    if (forBlueTeam) {
      if (isFinished)
        $('#calculating-team').hide();
      const team = _.difference(result.team, blueTeam);
      suggestedPicks.text(`${team.join(', ')} (score: ${result.fitness.toFixed(2)})`);
    } else {
      if (isFinished)
        $('#calculating-bans').hide();

      const team = _.difference(result.team, redTeam);
      suggestedBans.text(`${team.join(', ')} (score: ${result.fitness.toFixed(2)})`);
    }    
  }

  cache.worker.onerror = function (e) {
    alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message)
  }

  cache.worker.postMessage([window.stats.rawData, draftInfo]);
}

function itemAdd(select, hero) {
  const otherSelects = $('select.hero-select').toArray().filter(s => s != select);
  otherSelects.forEach(s => s.selectize.removeOption(hero));
  runSolver();
}

function itemRemove(select, hero) {
  const otherSelects = $('select.hero-select').toArray().filter(s => s != select);
  otherSelects.forEach(s => s.selectize.addOption({hero})); 
  runSolver();
}

function initializeHeroSelect(selector, heroes, maxItems) {
  const select = $(selector);
  select.selectize({
    maxItems,
    labelField: 'hero',
    searchField: 'hero',
    valueField: 'hero',
    options: heroes,
    create: false,
    closeAfterSelect: true,
    openOnFocus: false,
    onItemAdd: (value) => itemAdd(select[0], value),
    onItemRemove: (value) => itemRemove(select[0], value)
  });
}

// main function
(async () => {
  const stats = await loadStats();
  window.stats = stats;
  const heroes =  stats.heroes.map((hero) => ({hero}));
  const maps = stats.maps.map((map) => ({map}));


  // wait for document ready
  await new Promise((resolve) => $(() => resolve()));

  $('#select-map').selectize({
    labelField: 'map',
    searchField: 'map',
    valueField: 'map',
    options: maps,
    onChange: () => runSolver()
  });

  initializeHeroSelect('#select-exclude', heroes);
  initializeHeroSelect('#select-blue-bans', heroes, 2);
  initializeHeroSelect('#select-blue-team', heroes, 5);
  initializeHeroSelect('#select-red-bans', heroes, 2);
  initializeHeroSelect('#select-red-team', heroes, 5);

  $('#select-exclude')[0].selectize.setValue(['Cho', 'Gall']);
  initializing = false;
})();
