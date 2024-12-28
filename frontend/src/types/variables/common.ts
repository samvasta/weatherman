import { type Node } from "@xyflow/react";
import { z } from "zod";

import { type AnyVariableData } from "./allVariables";

export enum VariableType {
  Ceil = "ceil",
  Collector = "collector",
  Divide = "divide",
  Equals = "equals",
  Floor = "floor",
  Invert = "invert",
  IVar = "ivar",
  LessThan = "less",
  LessOrEqual = "lessOrEqual",
  Multiplexer = "multiplexer",
  Power = "power",
  Product = "product",
  Region = "region",
  Round = "round",
  Sum = "sum",
  Timer = "timer",
}

const BaseUISchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  isOutputFloating: z.boolean().default(false),
});

export const CommonVariableInfoSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),

  units: z.string().default(""),

  type: z.nativeEnum(VariableType),

  ui: BaseUISchema,
});

export const SafeUiSchema = z
  .object({
    ui: BaseUISchema.nullish()
      .default({
        id: "",
        x: 0,
        y: 0,
        isOutputFloating: false,
      })
      .transform(
        (data) =>
          data ?? {
            id: "",
            x: 0,
            y: 0,
            isOutputFloating: false,
          }
      ),
  })
  .passthrough();

export type CommonVariableInfoData = z.TypeOf<typeof CommonVariableInfoSchema>;

export const DEFAULT_COMMON_DATA: Omit<CommonVariableInfoData, "type"> = {
  name: "",
  description: "",
  units: "",
  ui: {
    id: "",
    x: 0,
    y: 0,
    isOutputFloating: false,
  },
};

type InputsInfo = {
  [targetPort: string]: string[];
};
export type OnConnectStrategy = "overwrite" | "append" | "block";

export type PortDef = {
  name: string;
  connectionStrategy: OnConnectStrategy;
};

export type OnUpdateVariable<T extends CommonVariableInfoData> = (
  nextData: Partial<T>,
  otherProps?: Partial<Omit<Node<AnyVariableData>, "data">>
) => void;

export type VariablePropertiesProps<T extends CommonVariableInfoData> = {
  data: T;
  onChange: OnUpdateVariable<T>;
};

export type VariableInfo<T extends CommonVariableInfoData> = {
  schema: z.ZodSchema<T>;
  defaultConfig: T;
  checkType: (variable: CommonVariableInfoData) => variable is T;
  getInputs: (variable: T) => InputsInfo;
  getPorts: (Variable: T) => PortDef[];
  hasOutput: boolean;
  VariableContent: React.ComponentType<{ data: T }>;
  VariablePreviewContent: React.ComponentType<{ data: T }>;
  VariableProperties: React.ComponentType<VariablePropertiesProps<T>>;
};
