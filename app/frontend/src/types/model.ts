import { z } from "zod";

import {
  type AnyVariableData,
  AnyVariableSchema,
} from "./variables/allVariables";

export type Model = {
  meta: { version: number };
  variables: AnyVariableData[];
  steps: number;
  iterations: number;
};

export const ModelSchema = z.object({
  meta: z.object({
    version: z.number().int(),
  }),
  variables: z.array(AnyVariableSchema),
  steps: z.number().int().positive().default(50),
  iterations: z.number().int().positive().default(5_000),
});
