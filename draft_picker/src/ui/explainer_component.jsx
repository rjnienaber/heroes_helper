import React, { Component } from "react";
import Explainer from '../solver/explainer';

export default class ExplainerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: props.stats,
      explainer: null,
      draftInfo: null,
      team: null
    }
  }

  explain(draftInfo, team) {
    this.setState(state => {
      state.explainer = new Explainer(this.state.stats, draftInfo);
      state.draftInfo = draftInfo;
      state.team = team;
      return state;
    })
  }

  render() {
    const { explainer, draftInfo, team, stats } = this.state;
    if (!explainer || !draftInfo || !team) {
      return (
        <div>
          <h1>Explainer</h1>
        </div>
      );
    }

    const { icy_veins_tier_list, ten_ton_tiers_list } = stats.urls;
    const hotsLogsUrl = 'https://www.hotslogs.com/Default';

    return (
      <div>
        <h2>Explainer</h2>
        {team.map((hero, index) => {
          const buildUrl = stats.heroes[hero].icy_veins_url;
          const synergyCounterUrl = buildUrl + '#sec-4';
          const mapsUrl = buildUrl + '#sec-5';
          const explained = explainer.explainHero(hero);
          return (
            <div key={index}>
              <h4><a href={buildUrl}>{hero}</a></h4>
              <ul>
                {explained.over50WinPercent && <li>Over 50 percent <a href={hotsLogsUrl}>win rate</a></li>}
                {explained.strongMap && <li>Strong on <a href={mapsUrl}>{draftInfo.map}</a></li>}
                {explained.synergies.length > 0 && <li><a href={synergyCounterUrl}>Synergies</a>: {explained.synergies.join(', ')}</li>}
                {explained.counters.length > 0 && <li><a href={synergyCounterUrl}>Counters</a>: {explained.counters.join(', ')}</li>}
                {explained.topTwoTenTonTiers && <li>Appears in top two tiers of <a href={ten_ton_tiers_list}>Ten Ton Tier</a></li>}
                {explained.topTwoIcyVeinsTiers && <li>Appears in top two tiers of <a href={icy_veins_tier_list}>Icy Veins Tier</a></li>}
              </ul>
            </div>
          )
        })}
      </div>
    );
  }
}
