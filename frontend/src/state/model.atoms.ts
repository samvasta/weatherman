import { atom } from "jotai";

import { CURRENT_VERSION } from "@/serialize/migrate";
import { type Model } from "@/types/model";
import { type IVarData, IVarInfo } from "@/types/variables/impl/ivar";

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

export const makeEmptyModel = (): Model => ({
  id: "",
  created: new Date(),
  updated: new Date(),
  schemaVersion: CURRENT_VERSION,
  name: "",
  variables: [],
  steps: 50,
  iterations: 5_000,
});

const compiledModelAtom = atom<Model>(makeEmptyModel());

export const getCompiledModelAtom = atom<Model>((get) =>
  get(compiledModelAtom)
);

export const setCompiledModelAtom = atom(
  null,
  (get, set, model: Partial<Model>) => {
    const current = get(compiledModelAtom);
    const next: Model = { ...current, ...model };
    set(compiledModelAtom, next);
  }
);

export const inputSheetsAtom = atom((get) => {
  const model = get(compiledModelAtom);
  const ivars = model.variables
    .filter(IVarInfo.checkType)
    .filter(
      (variable) => variable.inputSheetIds && variable.inputSheetIds.length > 0
    );

  const sheets = ivars.reduce(
    (sheets, ivar) => {
      for (const sheetName of ivar.inputSheetIds) {
        if (!(sheetName in sheets)) {
          sheets[sheetName] = [];
        }
        sheets[sheetName]!.push(ivar);
      }
      return sheets;
    },
    {} as Record<string, IVarData[]>
  );

  return sheets;
});
