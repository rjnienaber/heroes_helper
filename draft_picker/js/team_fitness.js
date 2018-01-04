const acceptableCompositions = [
  ['Assassin', 'Specialist', 'Support', 'Warrior', 'Warrior'],
  ['Assassin', 'Assassin', 'Specialist', 'Support', 'Warrior'],
  ['Assassin', 'Assassin', 'Support', 'Warrior', 'Warrior'],
  ['Assassin', 'Assassin', 'Assassin', 'Support', 'Warrior'],
  ['Assassin', 'Assassin', 'Support', 'Support', 'Warrior']
];

const grubbyTiers = {
  'S Tier': 100, 
  'T1 Tier': 66, 
  'T2 Tier': 33, 
  'T3 Tier': 0
}

const icyVeinsTiers = {
  'Prime Tier': 100,
  'Core Tier': 66,
  'Viable Tier': 33,
  'Niche Tier': 33,
  'Bottom Tier': 0
}

const tenTonTiers = {
  'S+ Tier': 100,
  'S Tier': 83, 
  'A+ Tier': 66, 
  'A Tier': 49, 
  'B+ Tier': 32, 
  'B Tier': 16, 
}

function precalculate(data, draftInfo) {
  const newData = {};
  let minWinPercent = 100;
  let maxWinPercent = 0;

  for (const hero in data) {
    const d = data[hero];
    minWinPercent = Math.min(minWinPercent, d.win_percent);
    maxWinPercent = Math.max(maxWinPercent, d.win_percent);        
  }

  const winMultiplier = maxWinPercent - minWinPercent;

  for (const hero in data) {
    const d = data[hero];
    const tiers = grubbyTiers[d.grubby_tier] + icyVeinsTiers[d.icy_veins_tier] + tenTonTiers[d.ten_ton_tier]
    let map = 0;
    if (d.maps.strong.includes(draftInfo.map)) {
      map += 50;
    } else if (d.maps.weak.includes(draftInfo.map)) {
      map -=50;
    } 

    newData[hero] = {
      tiers: tiers / 3,
      win_percent: ((d.win_percent - minWinPercent) / winMultiplier) * 100,
      map
    }
  };

  // console.log(newData)
  return newData;
}

class TeamFitness {
  constructor(data, draftInfo) {
    this.rawData = data;
    this.data = precalculate(data, draftInfo);
    this.draftInfo = draftInfo;
  }

  fitness(entity) {
    const composition = entity.map((e) => this.rawData[e].role).sort();
    const hasAcceptableComposition = acceptableCompositions.some(c => composition.every((v, i) => v === c[i]))    
    let score = hasAcceptableComposition ? 50 : -50;

    score += entity.reduce((sum, e) => sum + this.data[e].tiers, 0) / 5;
    score += entity.reduce((sum, e) => sum + this.data[e].win_percent, 0) / 5;
    score += entity.reduce((sum, e) => sum + this.data[e].map, 0) / 5;

    // calculate synergies
    const synergies = new Set();
    entity.forEach(e => this.rawData[e].synergies.forEach(s => synergies.add(s)));
    score += entity.reduce((sum, hero) => sum + (synergies.has(hero) ? 30 : 0), 0);

    // calculate opposing team counters
    const theirCounters = new Set();
    entity.forEach(e => this.rawData[e].counters.forEach(s => theirCounters.add(s)));
    score += this.draftInfo.theirTeam.reduce((sum, hero) => sum + (theirCounters.has(hero) ? -30 : 0), 0);

    // calculate our team counters to opposing team
    const ourCounters = new Set();
    this.draftInfo.theirTeam.forEach(e => this.rawData[e].counters.forEach(s => ourCounters.add(s)));
    score += entity.reduce((sum, hero) => sum + (ourCounters.has(hero) ? 30 : 0), 0);

    return score;
  }
}

module.exports = TeamFitness;
