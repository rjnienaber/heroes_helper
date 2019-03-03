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

  explain(blueTeam, redTeam, map) {
    const draftInfo = { map, blueTeam, redTeam };
    this.setState(state => {
      state.explainer = new Explainer(this.state.stats, draftInfo);
      state.draftInfo = draftInfo;
      state.team = blueTeam;
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
        {team.map((hero, index) => {
          const buildUrl = stats.heroes[hero].icy_veins_url;
          const synergyCounterUrl = buildUrl + '#sec-4';
          const mapsUrl = buildUrl + '#sec-5';
          const explained = explainer.explainHero(hero);
          return (
            <div key={index}>
              <h4><a href={buildUrl}>{hero}</a></h4>
              <ul>
                {explained.over50WinPercent && <li>Over 50 percent <a href={hotsLogsUrl} target="_blank">win rate</a></li>}
                {explained.strongMap && <li>Strong on <a href={mapsUrl} target="_blank">{draftInfo.map}</a></li>}
                {explained.synergies.length > 0 && <li><a href={synergyCounterUrl} target="_blank">Synergies</a>: {explained.synergies.join(', ')}</li>}
                {explained.counters.length > 0 && <li><a href={synergyCounterUrl} target="_blank">Counters</a>: {explained.counters.join(', ')}</li>}
                {explained.topTwoTenTonTiers && <li>Appears in top two tiers of <a href={ten_ton_tiers_list} target="_blank">Ten Ton Tier</a></li>}
                {explained.topTwoIcyVeinsTiers && <li>Appears in top two tiers of <a href={icy_veins_tier_list} target="_blank">Icy Veins Tier</a></li>}
              </ul>
            </div>
          )
        })}
      </div>
    );
  }
}
