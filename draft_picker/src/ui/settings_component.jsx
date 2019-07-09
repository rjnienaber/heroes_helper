import React, { Component } from "react";
import debounce from 'lodash/debounce';
import storage from 'local-storage';
import { SettingsSlider } from './settings_slider.jsx';
import { PlayerHeroes } from './player_heroes.jsx';

const RATIOS = [
  {name: 'Composition', key: 'composition', defaultValue: 100, url: 'https://www.hotslogs.com/Sitewide/TeamCompositions'},
  {name: 'Win Percent', key: 'winPercent', defaultValue: 100, url: 'https://apiapp.hotslogs.com/API/ReplayCharacterResults/-1,-1,-1/-1'},
  {name: 'Icy Veins Tiers', key: 'icyVeinsTiers', defaultValue: 50, url: 'https://www.icy-veins.com/forums/topic/43323-anduin-meta-tier-list-may-2019/'},
  {name: 'Ten Ton Tiers', key: 'tenTonTiers', defaultValue: 50, url: 'http://www.tentonhammer.com/articles/heroes-of-the-storm-tier-list'},
  {name: 'Strong Maps', key: 'strongMaps', defaultValue: 100},
  {name: 'Weak Maps', key: 'weakMaps', defaultValue: 100},
  {name: 'Synergies', key: 'synergies', defaultValue: 100},
  {name: 'Counters', key: 'counters', defaultValue: 100},
  {name: 'Opposing Counters', key: 'opposingCounters', defaultValue: 100}
];

const RATIO_FIELDS = RATIOS.map(r => r.key);

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.onChangeListeners = [];

    this.state = {
      heroPool: storage('settings.heroPool') || [[], [], [], [], []],
      ratios: storage('settings.ratios') || RATIOS.reduce((acc, r) => Object.assign(acc, {[r.key]: r.defaultValue}), {})
    };

    this.sliderRefs = RATIOS.reduce((acc, r) => Object.assign(acc, {[r.key]: React.createRef()}), {});
    this.heroPoolRefs = [0, 1, 2, 3, 4].map(() => React.createRef());
  }

  addOnChangeListener(listener) {
    this.onChangeListeners.push(listener);
  }

  get current() {
    const ratios = RATIO_FIELDS.reduce((acc, f) => Object.assign(acc, {[f]: this.sliderRefs[f].current.value / 100}), {});
    const heroPool = this.heroPoolRefs.map(h => h.current.heroes);

    return {ratios, heroPool}
  }

  reset() {
    RATIOS.forEach((r) => this.sliderRefs[r.key].current.value = r.defaultValue);
  }

  onChange() {
    const ratios = RATIO_FIELDS.reduce((acc, f) => Object.assign(acc, {[f]: this.sliderRefs[f].current.value}), {});
    storage('settings.ratios', ratios);
    this.onChangeListeners.forEach((func) => func());
  }

  onHeroChange(index) {
    const heroes = this.heroPoolRefs[index].current.heroes;
    this.setState(state => {
      state.heroPool[index] = heroes;
      storage('settings.heroPool', state.heroPool);
      return state;
    }, this.onChange);
  }

  onPlayerMove(index, direction) {
    let prevIndex = index;
    let newIndex = direction === 'up' ? index - 1 : index + 1;

    const prevIndexHeroes = this.heroPoolRefs[newIndex].current.heroes;
    const newIndexHeroes = this.heroPoolRefs[prevIndex].current.heroes;

    this.setState(state => {
      state.heroPool[newIndex] = newIndexHeroes;
      state.heroPool[prevIndex] = prevIndexHeroes;
      storage('settings.heroPool', state.heroPool);
      return state;
    }, () => {
      this.heroPoolRefs[prevIndex].current.heroes = prevIndexHeroes;
      this.heroPoolRefs[newIndex].current.heroes = newIndexHeroes;
    });
  }

  render() {
    const {allHeroes} = this.props;
    const {ratios} = this.state;
    const debounceOnChange = debounce(this.onChange.bind(this), 50);
    return (
      <div>
        <div className='container'>
          <h4>Ratios</h4>
          {RATIOS.map((r) => {
            return <SettingsSlider key={`setting-${r.key}`}
              ref={this.sliderRefs[r.key]}
              name={r.name}
              value={ratios[r.key]}
              onChange={debounceOnChange}
              url={r.url}
            />
          })}
          <div className='row'>
            <div className='col-sm-9'>
              <i>For strong/weak maps, synergies and counters, these come from the Icy Veins hero pages e.g. <a href='https://www.icy-veins.com/heroes/jaina-build-guide#sec-4'>Jaina</a>.</i>
            </div>
            <div className='col-sm-1'>
              <button className='btn btn-primary' onClick={this.reset.bind(this)}>Reset</button>
            </div>
          </div>
          <hr />
          <h4>Hero Pool</h4>
          {this.state.heroPool.map((p, i) => {
            return <PlayerHeroes key={`playerHero-${i}`}
              ref={this.heroPoolRefs[i]}
              index={i}
              allHeroes={allHeroes}
              heroes={p}
              onChange={this.onHeroChange.bind(this)}
              onPlayerMove={this.onPlayerMove.bind(this)}
            />
          })}
        </div>
      </div>
    );
  }
}