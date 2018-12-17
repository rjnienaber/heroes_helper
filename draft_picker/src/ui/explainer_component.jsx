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
    const { explainer, draftInfo, team } = this.state;
    if (!explainer || !draftInfo || !team) {
      return (
        <div>
          <h1>Explainer</h1>
        </div>
      );
    }

    return (
      <div>
        <h2>Explainer</h2>
        {team.map((hero, index) => {
          const explained = explainer.explainHero(hero);
          return (
            <div key={index}>
              <h4>{hero}</h4>
              <ul>
                {explained.over50WinPercent && <li>Over 50 percent win rate</li>}
                {explained.strongMap && <li>Strong on {draftInfo.map}</li>}
                {explained.synergies.length > 0 && <li>Synergies: {explained.synergies.join(', ')}</li>}
                {explained.counters.length > 0 && <li>Counters: {explained.counters.join(', ')}</li>}
                {explained.topTwoTenTonTiers && <li>Appears in top two tiers of Ten Ton Tier</li>}
                {explained.topTwoIcyVeinsTiers && <li>Appears in top two tiers of Icy Veins Tier</li>}
              </ul>
            </div>
          )
        })}
      </div>
    );
  }
}
