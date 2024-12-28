export function singleToList<T>(item: T): T[] {
  if (Boolean(item)) {
    return [item];
  }
  return [];
}
