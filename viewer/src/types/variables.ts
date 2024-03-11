import { z } from "zod";

import { AnyDistributionSchema } from "./distributions";

export enum VariableType {
  Collector = "collector",
  Divide = "divide",
  Invert = "invert",
  IVar = "ivar",
  Power = "power",
  Product = "product",
  Sum = "sum",
}

const CommonVariableInfoSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),

  units: z.string().default(""),
});
export type CommonVariableInfoData = z.infer<typeof CommonVariableInfoSchema>;

export const CollectorSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Collector).default(VariableType.Collector),

  input: z.string().min(1),
  target: z.string().nullable(),
});

export type CollectorData = z.infer<typeof CollectorSchema>;
export function isCollector(v: AnyVariableData): v is CollectorData {
  return v.type === VariableType.Collector;
}
function getCollectorInputs(collector: CollectorData): {
  [targetPort: string]: string;
} {
  return { input: collector.input };
}

export const DivideSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Divide).default(VariableType.Divide),

  quotient: z.string().min(1),
  divisor: z.string().min(1),
});

export type DivideData = z.infer<typeof DivideSchema>;
export function isDivide(v: AnyVariableData): v is DivideData {
  return v.type === VariableType.Divide;
}
function getDivideInputs(divide: DivideData): { [targetPort: string]: string } {
  return { quotient: divide.quotient, divisor: divide.divisor };
}

export const InvertSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Invert).default(VariableType.Invert),

  input: z.string().min(1),
});

export type InvertData = z.infer<typeof InvertSchema>;
export function isInvert(v: AnyVariableData): v is InvertData {
  return v.type === VariableType.Invert;
}
function getInvertInputs(invert: InvertData): { [targetPort: string]: string } {
  return { input: invert.input };
}

export const PowerSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Power).default(VariableType.Power),

  base: z.string().min(1),
  exponent: z.string().min(1),
});

export type PowerData = z.infer<typeof PowerSchema>;
export function isPower(v: AnyVariableData): v is PowerData {
  return v.type === VariableType.Power;
}
function getPowerInputs(power: PowerData): { [targetPort: string]: string } {
  return { exponent: power.exponent, base: power.base };
}

export const ProductSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Product).default(VariableType.Product),

  inputs: z.array(z.string().min(1)),
});

export type ProductData = z.infer<typeof ProductSchema>;
export function isProduct(v: AnyVariableData): v is ProductData {
  return v.type === VariableType.Product;
}
function getProductInputs(product: ProductData): {
  [targetPort: string]: string;
} {
  return product.inputs.reduce(
    (map, input, idx) => ({ ...map, [idx]: input }),
    {}
  );
}

export const SumSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Sum).default(VariableType.Sum),

  inputs: z.array(z.string().min(1)),
});

export type SumData = z.infer<typeof SumSchema>;
export function isSum(v: AnyVariableData): v is SumData {
  return v.type === VariableType.Sum;
}
function getSumInputs(sum: SumData): { [targetPort: string]: string } {
  return sum.inputs.reduce((map, input, idx) => ({ ...map, [idx]: input }), {});
}

export const IVarSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.IVar).default(VariableType.IVar),

  distribution: AnyDistributionSchema,
});

export type IVarData = z.infer<typeof IVarSchema>;
export function isIVar(v: AnyVariableData): v is IVarData {
  return v.type === VariableType.IVar;
}
function getIVarInputs(_iVar: IVarData): { [targetPort: string]: string } {
  return {};
}

export const AnyVariableSchema = z.union([
  CollectorSchema,
  DivideSchema,
  InvertSchema,
  PowerSchema,
  ProductSchema,
  SumSchema,
  IVarSchema,
]);
export type AnyVariableData = z.infer<typeof AnyVariableSchema>;
export function getVariableInputs(variable: AnyVariableData): {
  [targetPort: string]: string;
} {
  if (isCollector(variable)) {
    return getCollectorInputs(variable);
  }
  if (isDivide(variable)) {
    return getDivideInputs(variable);
  }
  if (isInvert(variable)) {
    return getInvertInputs(variable);
  }
  if (isPower(variable)) {
    return getPowerInputs(variable);
  }
  if (isProduct(variable)) {
    return getProductInputs(variable);
  }
  if (isSum(variable)) {
    return getSumInputs(variable);
  }
  if (isIVar(variable)) {
    return getIVarInputs(variable);
  }

  throw new Error("Unknown variable type");
}

export function getInputPortNames(variable: AnyVariableData): string[] {
  if (isCollector(variable)) {
    return ["input"];
  }
  if (isDivide(variable)) {
    return ["quotient", "divisor"];
  }
  if (isInvert(variable)) {
    return ["input"];
  }
  if (isPower(variable)) {
    return ["base", "exponent"];
  }
  if (isProduct(variable)) {
    return [
      ...variable.inputs.map((_, i) => i.toString()),
      variable.inputs.length.toString(),
    ];
  }
  if (isSum(variable)) {
    return [
      ...variable.inputs.map((_, i) => i.toString()),
      variable.inputs.length.toString(),
    ];
  }
  if (isIVar(variable)) {
    return [];
  }

  throw new Error("Unknown variable type");
}

export function setInput(
  variable: AnyVariableData,
  inputName: string | number,
  value: string
) {
  if (isProduct(variable)) {
    variable.inputs[Number(inputName)] = value;
  } else if (isSum(variable)) {
    variable.inputs[Number(inputName)] = value;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (variable as any)[inputName] = value;
  }
}

export function fromJSON(maybeVariable: unknown): AnyVariableData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const type = (maybeVariable as any).type;

  if (!type) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    throw new Error("Variable does not have type", maybeVariable as any);
  }

  switch (type) {
    case VariableType.Collector:
      return maybeVariable as CollectorData;

    case VariableType.Divide:
      return maybeVariable as DivideData;

    case VariableType.Invert:
      return maybeVariable as InvertData;

    case VariableType.Power:
      return maybeVariable as PowerData;

    case VariableType.Product:
      return maybeVariable as ProductData;

    case VariableType.Sum:
      return maybeVariable as SumData;

    case VariableType.IVar:
      return maybeVariable as IVarData;

    default:
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "Unrecognized variable type" + JSON.stringify(maybeVariable as any)
      );
  }
}
