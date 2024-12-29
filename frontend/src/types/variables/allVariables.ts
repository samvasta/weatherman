import { z } from "zod";

import { type WithNonNullKey } from "@/utils/types";

import { NodeUiData, type VariableInfo, VariableType } from "./common";
import { CeilInfo } from "./impl/ceil";
import { CollectorInfo } from "./impl/collector";
import { DivideInfo } from "./impl/divide";
import { EqualsInfo } from "./impl/equals";
import { FloorInfo } from "./impl/floor";
import { InvertInfo } from "./impl/invert";
import { IVarInfo } from "./impl/ivar";
import { LessOrEqualInfo } from "./impl/lessOrEqual";
import { LessThanInfo } from "./impl/lessThan";
import { MultiplexerInfo } from "./impl/multiplexer";
import { PowerInfo } from "./impl/power";
import { ProductInfo } from "./impl/product";
import { RegionInfo } from "./impl/region";
import { RoundInfo } from "./impl/round";
import { SumInfo } from "./impl/sum";
import { TimerInfo } from "./impl/timer";

export const AnyVariableSchema = z.union([
  CeilInfo.schema,
  CollectorInfo.schema,
  DivideInfo.schema,
  EqualsInfo.schema,
  FloorInfo.schema,
  InvertInfo.schema,
  LessThanInfo.schema,
  LessOrEqualInfo.schema,
  MultiplexerInfo.schema,
  PowerInfo.schema,
  ProductInfo.schema,
  RegionInfo.schema,
  RoundInfo.schema,
  SumInfo.schema,
  TimerInfo.schema,
  IVarInfo.schema,
]);

export type AnyVariableData = WithNonNullKey<
  z.TypeOf<
    Omit<typeof AnyVariableSchema, "ui"> & NodeUiData
  >,
  "ui"
>;

export const AllVariables: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [t in VariableType]: VariableInfo<any>;
} = {
  [VariableType.Ceil]: CeilInfo,
  [VariableType.Collector]: CollectorInfo,
  [VariableType.Divide]: DivideInfo,
  [VariableType.Equals]: EqualsInfo,
  [VariableType.Floor]: FloorInfo,
  [VariableType.Invert]: InvertInfo,
  [VariableType.LessThan]: LessThanInfo,
  [VariableType.LessOrEqual]: LessOrEqualInfo,
  [VariableType.Multiplexer]: MultiplexerInfo,
  [VariableType.Power]: PowerInfo,
  [VariableType.Product]: ProductInfo,
  [VariableType.Region]: RegionInfo,
  [VariableType.Round]: RoundInfo,
  [VariableType.Sum]: SumInfo,
  [VariableType.Timer]: TimerInfo,
  [VariableType.IVar]: IVarInfo,
};

export const VariableGroups = {
  Variables: [VariableType.IVar],
  Operators: [
    VariableType.Ceil,
    VariableType.Divide,
    VariableType.Equals,
    VariableType.Floor,
    VariableType.Invert,
    VariableType.Power,
    VariableType.Product,
    VariableType.Round,
    VariableType.Sum,
  ],
  Logic: [
    VariableType.LessThan,
    VariableType.LessOrEqual,
    VariableType.Multiplexer,
  ],
  Timing: [VariableType.Timer],
  Results: [VariableType.Collector],
  Organization: [VariableType.Region],
} as const;
