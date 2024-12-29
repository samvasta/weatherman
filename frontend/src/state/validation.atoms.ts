import { atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { type AuthModel } from "pocketbase";
import { type ZodIssue } from "zod";

import { getAuthModel } from "@/io/serverFns";
import { CURRENT_VERSION } from "@/serialize/migrate";
import { type Model } from "@/types/model";
import { type CollectorStats, type SimulationResult } from "@/types/results";
import { AnyVariableSchema } from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";
import { IVarData, IVarInfo } from "@/types/variables/impl/ivar";

import { getCompiledModelAtom } from "./model.atoms";

export const compileErrorsAtom = atom((get) => {
  const model = get(getCompiledModelAtom);
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

export const hasErrorsAtom = atom(
  (get) => Object.keys(get(compileErrorsAtom)).length > 0
);

export function useNodeErrors(nodeName: string) {
  const errors = useAtomValue(compileErrorsAtom);

  const nodeErrors = errors[nodeName] ?? [];

  return { errors: nodeErrors, hasError: nodeErrors.length > 0 };
}
