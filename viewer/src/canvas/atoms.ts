import { atom } from "jotai";

export const nodeNameToIdAtom = atom<Record<string, string>>({});
export const nodeIdToNameAtom = atom<Record<string, string>>({});

export const updateNodeNameAtom = atom(
  null,
  (get, set, { id, name }: { id: string; name: string }) => {
    const nameToIdMap = get(nodeNameToIdAtom);
    const idToNameMap = get(nodeIdToNameAtom);

    const nextNameToId = Object.entries(nameToIdMap).reduce(
      (map, [n, i]) => {
        if (i !== id) {
          map[n] = i;
        }
        return map;
      },
      {
        [name]: id,
      }
    );

    const nextIdToName = {
      ...idToNameMap,
      [id]: name,
    };

    set(nodeNameToIdAtom, nextNameToId);
    set(nodeIdToNameAtom, nextIdToName);
  }
);

export const initializeNodeNamesMapAtom = atom(
  null,
  (_, set, nameToId: Record<string, string>) => {
    const nextIdToName = Object.entries(nameToId).reduce(
      (map, [name, id]) => {
        map[id] = name;
        return map;
      },
      {} as Record<string, string>
    );

    set(nodeNameToIdAtom, nameToId);
    set(nodeIdToNameAtom, nextIdToName);
  }
);
