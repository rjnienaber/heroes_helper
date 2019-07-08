const hl = require('heroeslounge-api');
const lodash = require('lodash');
const cheerio = require('cheerio');
const stats = require('../stats.json');
const axios = require('axios');

async function heroeslounge(divisionName, teamName) {
  const divisions = await hl.getDivisions();
  const divisionIds = divisions.filter(d => d.title.includes(divisionName)).map(d => d.id);
  const teams = lodash.flatten(await Promise.all(divisionIds.map(id => hl.getDivisionTeams(id))));
  return teams.filter(t => t.title.includes(teamName));
}

function buildChildrenString(elements) {
  return elements.map((e) => {
    if (e.children && e.children.length > 0) {
      return buildChildrenString(e.children)
    } else if (e.type === 'text') {
      return e.data;
    }
  }).join('');
}

function parseTableBody(headers, range, rows) {
  const values = [];
  rows.map((_, r) => {
    const rowTds = r.children.filter(c => c.name === 'td');

    const rowValues = range.map(i => buildChildrenString(rowTds[i].children).trim());
    values.push(lodash.fromPairs(lodash.zip(headers, rowValues)));
  });
  return values;
}

class HotsLogsPlayerProfile {
  constructor(id, html) {
    this.id = id;
    this.$ = cheerio.load(html.toString());
  }

  name() {
    const elements = this.$('hgroup#h1Title h1');
    return elements[0].children[0].data.split(': ')[1];
  }

  generalInfo() {
    const rows = this.$('#ctl00_MainContent_RadGridGeneralInformation_ctl00').find('tbody tr');
    return parseTableBody(['name', 'text'], [0, 1], rows);
  }

  roles() {
    const rows = this.$('#RadGridPlayerSubRoleStatistics .rgMasterTable').find('tbody tr');
    return parseTableBody(['subRole', 'gamesPlayed', 'winPercent'], [0, 1, 2], rows).filter(r => r.winPercent !== '');
  }

  topThreeRoles() {
    return lodash.sortBy(this.roles(), r => parseInt(r.gamesPlayed)).reverse();
  }

  heroes() {
    const headers = ['name', 'heroLevel', 'gamesPlayed', 'averageLength', 'winPercent'];
    const rows = this.$('#ctl00_MainContent_RadGridCharacterStatistics_ctl00').find('tbody tr');
    const values = parseTableBody(headers, [2, 3, 4, 5, 6], rows);

    // fix hero names
    for (const v of values) {
      if (v.name === 'Deckard') {
        v.name = 'Deckard Cain';
      }
    }

    return values.filter(v => v.winPercent.trim() !== '').reverse();
  }

  likelyHeroes() {
    const highLevelHeroes = this.heroes().filter(h => parseInt(h.heroLevel, 10) >= 15);
    const noLowWinRate = highLevelHeroes.filter(h => parseFloat(h.winPercent) >= 45);
    return lodash.sortBy(noLowWinRate, v => parseInt(v.gamesPlayed)).reverse();
  }

  static async load(id) {
    const response = await axios.get(`https://www.hotslogs.com/Player/Profile?PlayerID=${id}`);
    return new HotsLogsPlayerProfile(id, response.data);
  }
}

function printStats(profile) {
  console.log(`Hero: ${profile.name()}`);
  console.log(`Roles: ${profile.topThreeRoles().map(r => `${r.subRole} (${r.winPercent})`).join(', ')}`);
  console.log('Hero'.padEnd(30) + '\tSub Role'.padEnd(20) + '\tLevel\tGames Played\tWin Percent');
  console.log('---------------------------------------------------------------');
  for (const h of profile.likelyHeroes()) {
    const role = stats.heroes[h.name].subrole;
    console.log(`${h.name.padEnd(30)}\t${role.padEnd(20)}\t${h.heroLevel}\t${h.gamesPlayed}\t\t${h.winPercent}`)
  }
  console.log('');
}

async function main() {
  const [division, team] = process.argv.slice(2, 4);
  const teams = await heroeslounge(division, team);
  if (teams.length !== 1) {
    console.log(`incorrect number of teams found: ${teams.length}`);
    process.exit(1);
  }

  const hotslogsIds = teams[0].sloths.map(t => t.hotslogs_id);
  console.log(`Team found, retrieving ids: ${hotslogsIds.join(', ')}`);

  // const hotslogsIds = ['11818511'];

  const profiles = await Promise.all(hotslogsIds.map(id => HotsLogsPlayerProfile.load(id)));

  for (const profile of profiles) {
    try {
      printStats(profile)
    } catch (err) {
      console.error(`Id: ${profile.id}`);
      console.error(err);
    }
  }
}

main();
