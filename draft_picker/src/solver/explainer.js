function calculateSynergies(hero, heroInfo, blueTeam) {
  return blueTeam.filter((h) => {
  	if (h === hero)
	  	return false;
	  return heroInfo.synergies.includes(h)
  });
}

function calculateCounters(hero, data, redTeam) {
	return redTeam.filter((h) => data.heroes[h].countered_by.includes(hero));
}

export default class Explainer {
  constructor(data, draftInfo) {
    this.data = data;
    this.draftInfo = draftInfo;
  }

  explainHero(hero) {
    const heroInfo = this.data.heroes[hero];
    const icyVeinsTier = Object.keys(this.data.tiers.icyVeins).slice(0, 2).includes(heroInfo.icy_veins_tier);
    const tenTonTier = Object.keys(this.data.tiers.tenTon).slice(0, 2).includes(heroInfo.ten_ton_tier);

    return {
		  over50WinPercent: heroInfo.win_percent > 50,
		  strongMap: heroInfo.maps.strong.includes(this.draftInfo.map),
		  synergies: calculateSynergies(hero, heroInfo, this.draftInfo.blueTeam),
      counters: calculateCounters(hero, this.data, this.draftInfo.redTeam),
		  topTwoTenTonTiers: icyVeinsTier,
		  topTwoIcyVeinsTiers: tenTonTier,
    }
  }
}
