import difference from 'lodash/difference';

export default class UI {
  constructor(stats, Worker, explainerComponent, settingsComponent) {
    this.initializing = true;
    this.cache = {};
    this.stats = stats;
    this.worker = Worker;
    this.explainerComponent = explainerComponent;
    this.settingsComponent = settingsComponent;
    settingsComponent.addOnChangeListener(() => this.runSolver());
  }

  copyToClipboard(event) {
    const heroes = $(event.target).parents('.row').find('#suggested-picks .heroesList,#suggested-bans .heroesList').text();
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(heroes).select();
    document.execCommand("copy");

    $temp.remove();
  }

  async start(heroes) {
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
    this.initializeHeroSelect('#select-blue-team', heroes, 5);
    this.initializeHeroSelect('#select-red-team', heroes, 5);

    $('#select-exclude')[0].selectize.setValue(['Cho', 'Gall']);
    $('.copy-heroes').click(this.copyToClipboard);
    this.initializing = false;
  }

  get map() {
    return $('#select-map')[0].selectize.items[0];
  }

  async runSolver() {
    if (this.initializing)
      return;

    const blueTeam = $('#select-blue-team')[0].selectize.items;
    const redTeam = $('#select-red-team')[0].selectize.items;

    const draftInfo = {
      map: this.map,
      unavailable: $('#select-exclude')[0].selectize.items,
      blueTeam,
      redTeam,
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

        this.explainerComponent.explain(result.team, redTeam, this.map);
        const team = difference(result.team, blueTeam);
        this.displayTeam(suggestedPicks, team, result);
      } else {
        if (isFinished)
          $('#calculating-bans').hide();

        const team = difference(result.team, redTeam);
        this.displayTeam(suggestedBans, team, result);
      }
    };

    this.cache.worker.onerror = (e) => {
      alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message)
    };

    this.cache.worker.postMessage([this.stats.rawData, draftInfo, this.settingsComponent.current]);
  }

  displayTeam(element, team, result) {
    element.html('');
    for (const t of team) {
      const newButton = $('<button type="button" class="btn btn-info btn-sm btn-dark">').append(t).click(() => this.addToExclude(t));
      element.append(newButton).append(' ')
    }
    element.append(`<span>(score: ${result.fitness.toFixed(2)})</span>`);
    element.append(`<span class='heroesList' style='display: none'>${team.join(', ')}</span>`);
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
