import { z } from "zod";

import { WithNonNullKey } from "@/utils/types";
import { SafeUiSchema, VariableType, type VariableInfo } from "./common";
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
import { TimerInfo } from "./impl/timer";
import { MultiplexerInfo } from "./impl/multiplexer";
import { RegionInfo } from "./impl/region";

export const AnyVariableSchema = z.union([
  CollectorInfo.schema,
  DivideInfo.schema,
  EqualsInfo.schema,
  InvertInfo.schema,
  LessThanInfo.schema,
  LessOrEqualInfo.schema,
  MultiplexerInfo.schema,
  PowerInfo.schema,
  ProductInfo.schema,
  RegionInfo.schema,
  SumInfo.schema,
  TimerInfo.schema,
  IVarInfo.schema,
]);

export type AnyVariableData = WithNonNullKey<
  z.TypeOf<
    Omit<typeof AnyVariableSchema, "ui"> & {
      ui: {
        x: number;
        y: number;
        id: string;
      };
    }
  >,
  "ui"
>;

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
  [VariableType.Multiplexer]: MultiplexerInfo,
  [VariableType.Power]: PowerInfo,
  [VariableType.Product]: ProductInfo,
  [VariableType.Region]: RegionInfo,
  [VariableType.Sum]: SumInfo,
  [VariableType.Timer]: TimerInfo,
  [VariableType.IVar]: IVarInfo,
};
