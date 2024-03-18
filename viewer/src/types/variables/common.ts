import { z } from "zod";

export enum VariableType {
  Collector = "collector",
  Divide = "divide",
  Invert = "invert",
  IVar = "ivar",
  Power = "power",
  Product = "product",
  Sum = "sum",
}

export const CommonVariableInfoSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),

  units: z.string().default(""),

  type: z.nativeEnum(VariableType),

  ui: z
    .object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
    })
    .optional()
    .default({
      id: "",
      x: 0,
      y: 0,
    }),
});

export type CommonVariableInfoData = z.TypeOf<typeof CommonVariableInfoSchema>;

export const DEFAULT_COMMON_DATA: Omit<CommonVariableInfoData, "type"> = {
  name: "",
  description: "",
  units: "",
  ui: {
    id: "",
    x: 0,
    y: 0,
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
  nextData: Partial<T>
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
