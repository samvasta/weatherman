import { z } from "zod";
import { AnyDistributionSchema } from "../distributions/allDistributions";
import { CommonVariableInfoData, CommonVariableInfoSchema, VariableType } from "./common";


export const IVarSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.IVar).default(VariableType.IVar),

  distribution: AnyDistributionSchema,

  inputSheetIds: z.array(z.string()),
});

export type IVarData = z.TypeOf<typeof IVarSchema>;

export function isIVar(v: CommonVariableInfoData): v is IVarData {
  return v.type === VariableType.IVar;
}