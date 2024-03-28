import { z } from "zod";

import { type VariableInfo, VariableType } from "./common";
import { CollectorInfo } from "./impl/collector";
import { DivideInfo } from "./impl/divide";
import { EqualsInfo } from "./impl/equals";
import { InvertInfo } from "./impl/invert";
import { IVarInfo } from "./impl/ivar";
import { LessOrEqualInfo } from "./impl/lessOrEqual";
import { LessThanInfo } from "./impl/lessThan";
import { PowerInfo } from "./impl/power";
import { ProductInfo } from "./impl/product";
import { SumInfo } from "./impl/sum";

export const AnyVariableSchema = z.union([
  CollectorInfo.schema,
  DivideInfo.schema,
  EqualsInfo.schema,
  InvertInfo.schema,
  LessThanInfo.schema,
  LessOrEqualInfo.schema,
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
  [VariableType.Equals]: EqualsInfo,
  [VariableType.Invert]: InvertInfo,
  [VariableType.LessThan]: LessThanInfo,
  [VariableType.LessOrEqual]: LessOrEqualInfo,
  [VariableType.Power]: PowerInfo,
  [VariableType.Product]: ProductInfo,
  [VariableType.Sum]: SumInfo,
  [VariableType.IVar]: IVarInfo,
};
