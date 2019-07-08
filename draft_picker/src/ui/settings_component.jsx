import React, { Component } from "react";
import debounce from 'lodash/debounce';
import { SettingsSlider } from './settings_slider.jsx';
import { PlayerHeroes } from './player_heroes.jsx';

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.onChangeListeners = [];

    this.composition = React.createRef();
    this.winPercent = React.createRef();
    this.icyVeinsTiers = React.createRef();
    this.tenTonTiers = React.createRef();
    this.strongMaps = React.createRef();
    this.weakMaps = React.createRef();
    this.synergies = React.createRef();
    this.counters = React.createRef();
    this.opposingCounters = React.createRef();

    this.state = {
      heroPool: [[], [], [], [], []]
    };

    this.heroPoolRefs = [0, 1, 2, 3, 4].map(() => React.createRef());
  }

  addOnChangeListener(listener) {
    this.onChangeListeners.push(listener);
  }

  get current() {
    const fields = [
      'composition', 'winPercent', 'icyVeinsTiers', 'tenTonTiers', 'strongMaps', 'weakMaps', 'synergies', 'counters',
      'opposingCounters'
    ];

    const ratios = fields.reduce((acc, f) => Object.assign(acc, {[f]: this[f].current.value}), {});
    const heroPool = this.heroPoolRefs.map(h => h.current.heroes);

    return {ratios, heroPool}
  }

  reset() {
    this.composition.current.value = 100;
    this.winPercent.current.value = 100;
    this.icyVeinsTiers.current.value = 50;
    this.tenTonTiers.current.value = 50;
    this.strongMaps.current.value = 100;
    this.weakMaps.current.value = 100;
    this.synergies.current.value = 100;
    this.counters.current.value = 100;
    this.opposingCounters.current.value = 100;
  }

  onChange() {
    this.onChangeListeners.forEach((func) => func());
  }

  onHeroChange(index) {
    const heroes = this.heroPoolRefs[index].current.heroes;
    this.setState(state => {
      state.heroPool[index] = heroes;
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
      return state;
    }, () => {
      this.heroPoolRefs[prevIndex].current.heroes = prevIndexHeroes;
      this.heroPoolRefs[newIndex].current.heroes = newIndexHeroes;
    });
  }

  render() {
    const {allHeroes} = this.props;
    const debounceOnChange = debounce(this.onChange.bind(this), 50);
    return (
      <div>
        <div className='container'>
          <h4>Ratios</h4>
          <SettingsSlider ref={this.composition} name={'Composition'} onChange={debounceOnChange} url={'https://www.hotslogs.com/Sitewide/TeamCompositions'} />
          <SettingsSlider ref={this.winPercent} name={'Win Percent'} onChange={debounceOnChange} url={'https://apiapp.hotslogs.com/API/ReplayCharacterResults/-1,-1,-1/-1'} />
          <SettingsSlider ref={this.icyVeinsTiers} name={'Icy Veins Tiers'} onChange={debounceOnChange} value={50} url={'https://www.icy-veins.com/forums/topic/43323-anduin-meta-tier-list-may-2019/'} />
          <SettingsSlider ref={this.tenTonTiers} name={'Ten Ton Tiers'} onChange={debounceOnChange} value={50} url={'http://www.tentonhammer.com/articles/heroes-of-the-storm-tier-list'}/>
          <SettingsSlider ref={this.strongMaps} name={'Strong Maps'} onChange={debounceOnChange} />
          <SettingsSlider ref={this.weakMaps} name={'Weak Maps'} onChange={debounceOnChange} />
          <SettingsSlider ref={this.synergies} name={'Synergies'} onChange={debounceOnChange} />
          <SettingsSlider ref={this.counters} name={'Counters'} onChange={debounceOnChange} />
          <SettingsSlider ref={this.opposingCounters} name={'Opposing Team Counters'} onChange={debounceOnChange} />
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