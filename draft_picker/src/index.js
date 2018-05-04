import 'jquery'
import 'selectize'
import 'bootstrap'
import _ from 'lodash';
import Tiers from './tiers'
import { default as data } from '../stats.json'
import Worker from 'worker-loader!./worker.js';

function loadStats() {
  data.tiers = Tiers.all;
  const hero_stats = data.heroes;
  const heroes = Object.keys(hero_stats);
  const maps = _.uniq(_.flatten(heroes.map((h) => hero_stats[h].maps.strong.concat(hero_stats[h].maps.average).concat(hero_stats[h].maps.weak)))).sort();

  return {
    heroes, maps,
    rawData: data
  };
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
  cache.worker = new Worker();

  cache.worker.onmessage = (e) => {
    const {result, isFinished, forBlueTeam} = e.data;
    if (forBlueTeam) {
      if (isFinished)
        $('#calculating-team').hide();
      const team = _.difference(result.team, blueTeam);
      displayTeam(suggestedPicks, team, result);
    } else {
      if (isFinished)
        $('#calculating-bans').hide();

      const team = _.difference(result.team, redTeam);
      displayTeam(suggestedBans, team, result);
    }    
  }

  cache.worker.onerror = (e) => {
    alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message)
  }

  cache.worker.postMessage([window.stats.rawData, draftInfo]);
}

function displayTeam(element, team, result) {
  element.html('')
  for (const t of team) {
    const newButton = $('<button type="button" class="btn btn-info btn-xs">').append(t).click(() => addToExclude(t));
    element.append(newButton).append(' ')
  }
  element.append(`<span>(score: ${result.fitness.toFixed(2)})</span>`)
}

function addToExclude(hero) {
  $('#select-exclude')[0].selectize.addItem(hero);
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
  const stats = loadStats();
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
