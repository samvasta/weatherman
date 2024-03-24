import { atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { type ZodIssue } from "zod";

import { type Model } from "@/types/model";
import { type CollectorStats, type SimulationResult } from "@/types/results";
import { AnyVariableSchema } from "@/types/variables/allVariables";

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

export const compiledModelAtom = atom<Model>({ variables: [] });
export const compileErrorsAtom = selectAtom(compiledModelAtom, (model) => {
  const errorMap: {
    [name: string]: ZodIssue[];
  } = {};

  for (const variable of model.variables) {
    const result = AnyVariableSchema.safeParse(variable);
    if (!result.success) {
      if (errorMap[variable.name]) {
        errorMap[variable.name]!.push(...result.error.issues);
      } else {
        errorMap[variable.name] = [...result.error.issues];
      }
    }
  }

  return errorMap;
});

export const hasErrorsAtom = selectAtom(
  compileErrorsAtom,
  (errors) => Object.keys(errors).length > 0
);

export function useNodeErrors(nodeName: string) {
  const errors = useAtomValue(compileErrorsAtom);

  const nodeErrors = errors[nodeName] ?? [];

  return { errors: nodeErrors, hasError: nodeErrors.length > 0 };
}

export const fileNameAtom = atom<string>("model");

export const simulationResultAtom = atom<SimulationResult | null>(null);

export function useSimulationResultForNode(
  nodeName: string
): CollectorStats | null {
  const results = useAtomValue(simulationResultAtom);

  return results?.[nodeName] ?? null;
}