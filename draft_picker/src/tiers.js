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
  'Bottom Tier': 0,
  'Lost Vikings Tier': 0
}

const tenTonTiers = {
  'S Tier *': 100, 
  'A+ Tier': 75, 
  'A Tier': 50, 
  'B Tier': 25, 
  'C Tier': 0, 
}

class Tiers {
  static get all() {
    return {
      grubby: grubbyTiers,
      icyVeins: icyVeinsTiers,
      tenTon: tenTonTiers
    }
  }
}

module.exports = Tiers;
