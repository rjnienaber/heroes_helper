export function precalculateCompositions(data, draftInfo) {
  let mapStats = data.map_stats[draftInfo.map];
  if (!mapStats)
    mapStats = data.map_stats['All Maps'];

  return mapStats.map((s) => s.roles.sort());
}

export function precalculateHero(data, draftInfo, ratios) {
  const newData = {};
  let minWinPercent = 100;
  let maxWinPercent = 0;

  for (const hero in data.heroes) {
    const d = data.heroes[hero];
    minWinPercent = Math.min(minWinPercent, d.win_percent);
    maxWinPercent = Math.max(maxWinPercent, d.win_percent);
  }

  const winMultiplier = maxWinPercent - minWinPercent;
  const { icyVeins, tenTon } = data.tiers;

  for (const hero of Object.keys(data.heroes)) {
    const d = data.heroes[hero];
    let preCalculated = 0;

    preCalculated = (icyVeins[d.icy_veins_tier] * ratios.icyVeinsTiers) + (tenTon[d.ten_ton_tier] * ratios.tenTonTiers);

    preCalculated += ((d.win_percent - minWinPercent) / winMultiplier) * 100 * ratios.winPercent;

    if (d.maps.strong.includes(draftInfo.map)) {
      preCalculated += 50 * ratios.strongMaps;
    } else if (d.maps.weak.includes(draftInfo.map)) {
      preCalculated -=50 * ratios.weakMaps;
    }

    if (Number.isNaN(preCalculated)) {
      console.log(`NaN precalculated for ${hero}`);
      console.log(`Icy Veins tier: ${icyVeins[d.icy_veins_tier]}`);
      console.log(`Ten Ton tier: ${tenTon[d.ten_ton_tier]}`);
      console.log(`Win Percent: ${d.win_percent}`);
      console.log(d);
      process.exit(1)
    }

    newData[hero] = {
      preCalculated,
      role: d.role,
      subrole: d.subrole,
      synergies: d.synergies,
      countered_by: d.countered_by
    }
  }

  return newData;
}