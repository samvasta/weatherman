import { z } from "zod";

import {
  type AnyVariableData,
  AnyVariableSchema,
} from "./variables/allVariables";

export type Model = {
  id: string;
  updated: Date;
  created: Date;
  name: string;
  schemaVersion: number;
  variables: AnyVariableData[];
  steps: number;
  iterations: number;
};

export type ModelFileInfo = Pick<Model, "id" | "name" | "created" | "updated">;

export const ModelSchema = z.object({
  id: z.string(),
  updated: z.date(),
  created: z.date(),
  name: z.string(),
  schemaVersion: z.number(),
  variables: z.array(AnyVariableSchema),
  steps: z.number().int().positive().default(50),
  iterations: z.number().int().positive().default(5_000),
});
