import { z } from "zod";

export enum DistributionType {
  Constant = "constant",
  Uniform = "uniform",
  Normal = "normal",
  AsymmetricNormal = "asymmetric_normal",
  Laplace = "laplace",
  Choice = "choice",
}

export const ConstantSchema = z.object({
  type: z.literal(DistributionType.Constant).default(DistributionType.Constant),
  value: z.number().finite(),
});

export type ConstantData = z.infer<typeof ConstantSchema>;
export function isConstant(
  distribution: AnyDistributionData
): distribution is ConstantData {
  return distribution.type === DistributionType.Constant;
}

export const UniformSchema = z
  .object({
    type: z.literal(DistributionType.Uniform).default(DistributionType.Uniform),
    min: z.number().finite(),
    max: z.number().finite(),
  })
  .superRefine(({ min, max }, ctx) => {
    if (min > max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        path: ["min"],
        message: "The minimum value cannot be greater than the maximum value",
        inclusive: true,
      });
    }
  });

export type UniformData = z.infer<typeof UniformSchema>;
export function isUniform(
  distribution: AnyDistributionData
): distribution is UniformData {
  return distribution.type === DistributionType.Uniform;
}

export const NormalSchema = z.object({
  type: z.literal(DistributionType.Normal).default(DistributionType.Normal),
  mean: z.number().finite(),
  stdDev: z
    .number()
    .finite()
    .nonnegative("Standard deviation cannot be negative."),
});

export type NormalData = z.infer<typeof NormalSchema>;
export function isNormal(
  distribution: AnyDistributionData
): distribution is NormalData {
  return distribution.type === DistributionType.Normal;
}

export const AsymmetricNormalSchema = z
  .object({
    type: z
      .literal(DistributionType.AsymmetricNormal)
      .default(DistributionType.AsymmetricNormal),
    mean: z.number().finite(),
    stdDevLow: z
      .number()
      .finite()
      .nonnegative("Standard deviation cannot be negative."),
    stdDevHigh: z
      .number()
      .finite()
      .nonnegative("Standard deviation cannot be negative."),
    min: z.number().finite(),
    max: z.number().finite(),
  })
  .superRefine(({ min, max, mean, stdDevLow, stdDevHigh }, ctx) => {
    if (min >= max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        inclusive: false,
        message: "The minimum value must be less than the maximum value",
      });
    }
    if (mean <= min) {
      ctx.addIssue({
        code: "too_small",
        minimum: min,
        type: "number",
        inclusive: false,
        message: "The mean value must be greater than the minimum value",
      });
    }
    if (mean >= max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        inclusive: false,
        message: "The mean value must be less than the maximum value",
      });
    }
  });

export type AsymmetricNormalData = z.infer<typeof AsymmetricNormalSchema>;
export function isAsymmetricNormal(
  distribution: AnyDistributionData
): distribution is AsymmetricNormalData {
  return distribution.type === DistributionType.AsymmetricNormal;
}

export const LaplaceSchema = z.object({
  type: z.literal(DistributionType.Laplace).default(DistributionType.Laplace),
  mean: z.number().finite(),
  stdDev: z
    .number()
    .finite()
    .nonnegative("Standard deviation cannot be negative."),
});

export type LaplaceData = z.infer<typeof LaplaceSchema>;
export function isLaplace(
  distribution: AnyDistributionData
): distribution is LaplaceData {
  return distribution.type === DistributionType.Laplace;
}

export const ChoiceSchema = z.object({
  type: z.literal(DistributionType.Choice).default(DistributionType.Choice),
  options: z
    .array(
      z.object({
        value: z.number().finite(),
        weight: z.number().finite().positive("Weight must be positive."),
      })
    )
    .min(1),
});

export type ChoiceData = z.infer<typeof ChoiceSchema>;
export function isChoice(
  distribution: AnyDistributionData
): distribution is ChoiceData {
  return distribution.type === DistributionType.Choice;
}

export const AnyDistributionSchema = z.union([
  ConstantSchema,
  UniformSchema,
  NormalSchema,
  AsymmetricNormalSchema,
  LaplaceSchema,
  ChoiceSchema,
]);

export type AnyDistributionData = z.infer<typeof AnyDistributionSchema>;

export function getDefaultDistributionData(
  type: DistributionType
): AnyDistributionData {
  switch (type) {
    case DistributionType.Choice:
      return {
        type,
        options: [
          {
            value: 0,
            weight: 1,
          },
          {
            value: 1,
            weight: 1,
          },
        ],
      } as ChoiceData;

    case DistributionType.Constant:
      return {
        type,
        value: 1,
      } as ConstantData;

    case DistributionType.Normal:
      return {
        type,
        mean: 1,
        stdDev: 0.5,
      };

    case DistributionType.AsymmetricNormal:
      return {
        type,
        mean: 5,
        stdDevLow: 1,
        stdDevHigh: 2,
        min: 0,
        max: 10,
      };

    case DistributionType.Laplace:
      return {
        type,
        mean: 1,
        stdDev: 0.5,
      };

    case DistributionType.Uniform:
      return {
        type,
        min: 0,
        max: 10,
      };

    default:
      throw new Error(
        "Unrecognized distribution type " + (type as unknown as string)
      );
  }
}
