import { z } from "zod";

import {
  type AnyVariableData,
  AnyVariableSchema,
} from "./variables/allVariables";

export type Model = {
  variables: AnyVariableData[];
};

export const ModelSchema = z.object({
  variables: z.array(AnyVariableSchema),
});
