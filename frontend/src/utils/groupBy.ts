export function groupBy<T>(
  items: T[],
  getGroup: (item: T) => string | number
): { [group: string | number]: T[] } {
  const groups: { [group: string | number]: T[] } = {};

  for (const item of items) {
    const group = getGroup(item);
    if (!(group in groups)) {
      groups[group] = [item];
    } else {
      groups[group]!.push(item);
    }
  }

  return groups;
}
