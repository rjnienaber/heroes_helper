import difference from 'lodash/difference';

export default class UI {
  constructor(stats, Worker) {
    this.initializing = true
    this.cache = {}
    this.stats = stats
    this.worker = Worker
  }

  async start() {
    const heroes =  this.stats.heroes.map((hero) => ({hero}));
    const maps = this.stats.maps.map((map) => ({map}));

    // wait for document ready
    await new Promise((resolve) => $(() => resolve()));

    $('#select-map').selectize({
      labelField: 'map',
      searchField: 'map',
      valueField: 'map',
      options: maps,
      onChange: () => this.runSolver()
    });

    this.initializeHeroSelect('#select-exclude', heroes);
    this.initializeHeroSelect('#select-blue-bans', heroes, 2);
    this.initializeHeroSelect('#select-blue-team', heroes, 5);
    this.initializeHeroSelect('#select-red-bans', heroes, 2);
    this.initializeHeroSelect('#select-red-team', heroes, 5);

    $('#select-exclude')[0].selectize.setValue(['Cho', 'Gall']);
    this.initializing = false;
  }

  async runSolver(Worker) {
    if (this.initializing)
      return;

    const blueTeam = $('#select-blue-team')[0].selectize.items;
    const redTeam = $('#select-red-team')[0].selectize.items;

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

    if (this.cache.worker)
      this.cache.worker.terminate();
    this.cache.worker = this.worker();

    this.cache.worker.onmessage = (e) => {
      const {result, isFinished, forBlueTeam} = e.data;
      if (forBlueTeam) {
        if (isFinished)
          $('#calculating-team').hide();
        const team = difference(result.team, blueTeam);
        this.displayTeam(suggestedPicks, team, result);
      } else {
        if (isFinished)
          $('#calculating-bans').hide();

        const team = difference(result.team, redTeam);
        this.displayTeam(suggestedBans, team, result);
      }
    }

    this.cache.worker.onerror = (e) => {
      alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message)
    }

    this.cache.worker.postMessage([this.stats.rawData, draftInfo]);
  }

  displayTeam(element, team, result) {
    element.html('')
    for (const t of team) {
      const newButton = $('<button type="button" class="btn btn-info btn-xs">').append(t).click(() => this.addToExclude(t));
      element.append(newButton).append(' ')
    }
    element.append(`<span>(score: ${result.fitness.toFixed(2)})</span>`)
  }

  addToExclude(hero) {
    $('#select-exclude')[0].selectize.addItem(hero);
  }

  itemAdd(select, hero) {
    const otherSelects = $('select.hero-select').toArray().filter(s => s != select);
    otherSelects.forEach(s => s.selectize.removeOption(hero));
    this.runSolver();
  }

  itemRemove(select, hero) {
    const otherSelects = $('select.hero-select').toArray().filter(s => s != select);
    otherSelects.forEach(s => s.selectize.addOption({hero}));
    this.runSolver();
  }

  initializeHeroSelect(selector, heroes, maxItems) {
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
      onItemAdd: (value) => this.itemAdd(select[0], value),
      onItemRemove: (value) => this.itemRemove(select[0], value)
    });
  }
}
