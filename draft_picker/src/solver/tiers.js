const grubbyTiers = ['S Tier', 'T1 Tier', 'T2 Tier', 'T3 Tier'];

const icyVeinsTiers = ['Meta picks', 'High-tier generalists', 'Mid-tier generalists', 'Low-tier generalists',
  'Situational picks (map, team composition, or counterpick)'];

const tenTonTiers = ['S+ Tier', 'S Tier', 'A+ Tier', 'A Tier', 'B Tier', 'C Tier'];

function calculateTierValues(values) {
  const increment = 100 / (values.length - 1);
  let start = 100;
  return values.reduce((acc, v, index) => {
    if (index === values.length - 1) {
      acc[v] = 0;
    } else {
      acc[v] = parseInt(start, 0);
      start -= increment;
    }
    return acc;
  }, {});
}

export default class Tiers {
  static get all() {
    return {
      grubby: calculateTierValues(grubbyTiers),
      icyVeins: calculateTierValues(icyVeinsTiers),
      tenTon: calculateTierValues(tenTonTiers)
    }
  }
}
