const grubbyTiers = {
  'S Tier': 100, 
  'T1 Tier': 66, 
  'T2 Tier': 33, 
  'T3 Tier': 0
}

const icyVeinsTiers = {
  'Meta picks': 100,
  'High-tier generalists': 75,
  'Mid-tier generalists': 50,
  'Low-tier generalists': 25,
  'Situational picks (map, team composition, or counterpick)': 0
}

const tenTonTiers = {
  'S Tier *': 100, 
  'A+ Tier': 75, 
  'A Tier': 50, 
  'B Tier': 25, 
  'C Tier': 0, 
}

export default class Tiers {
  static get all() {
    return {
      grubby: grubbyTiers,
      icyVeins: icyVeinsTiers,
      tenTon: tenTonTiers
    }
  }
}
