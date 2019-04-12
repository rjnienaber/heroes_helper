export function compositionSorter(a, b, data) {
  const roleA = data[a].role;
  const roleB = data[b].role;
  if (roleA === roleB) {
    if (a === b) {
      return 0;
    } else {
      return a > b ? 1 : -1
    }
  }

  if (roleA === 'Warrior')
    return -1;
  else if (roleB === 'Warrior')
    return 1;

  if (roleA === 'Assassin')
    return -1;
  else if (roleB === 'Assassin')
    return 1;

  if (roleA === 'Specialist')
    return -1;
  else if (roleB === 'Specialist')
    return 1;

  if (roleA === 'Multiclass')
    return -1;
  else if (roleB === 'Multiclass')
    return 1;

  if (roleA === 'Support')
    return -1;
  else if (roleB === 'Support')
    return 1;

}
