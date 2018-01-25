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

class Tiers {
  static get all() {
    return {
      grubby: grubbyTiers,
      icyVeins: icyVeinsTiers,
      tenTon: tenTonTiers
    }
  }
}

// so we don't have to build to run in the browser
if (typeof module !== 'undefined') {
  module.exports = Tiers
}