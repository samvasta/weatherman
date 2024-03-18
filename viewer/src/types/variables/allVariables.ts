import { z } from "zod";

import { type VariableInfo, VariableType } from "./common";
import { CollectorInfo } from "./impl/collector";
import { DivideInfo } from "./impl/divide";
import { InvertInfo } from "./impl/invert";
import { IVarInfo } from "./impl/ivar";
import { PowerInfo } from "./impl/power";
import { ProductInfo } from "./impl/product";
import { SumInfo } from "./impl/sum";

export const AnyVariableSchema = z.union([
  CollectorInfo.schema,
  DivideInfo.schema,
  InvertInfo.schema,
  PowerInfo.schema,
  ProductInfo.schema,
  SumInfo.schema,
  IVarInfo.schema,
]);

export type AnyVariableData = z.TypeOf<typeof AnyVariableSchema>;

export const AllVariables: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [t in VariableType]: VariableInfo<any>;
} = {
  [VariableType.Collector]: CollectorInfo,
  [VariableType.Divide]: DivideInfo,
  [VariableType.Invert]: InvertInfo,
  [VariableType.Power]: PowerInfo,
  [VariableType.Product]: ProductInfo,
  [VariableType.Sum]: SumInfo,
  [VariableType.IVar]: IVarInfo,
};
