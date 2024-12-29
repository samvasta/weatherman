import { z } from "zod";

export enum DistributionType {
  Constant = "constant",
  Uniform = "uniform",
  Normal = "normal",
  AsymmetricNormal = "asymmetric_normal",
  Laplace = "laplace",
  Choice = "choice",
}

export const CommonDistributionInfoSchema = z.object({
  type: z.nativeEnum(DistributionType),
});

export type CommonDistributionInfoData = z.infer<
  typeof CommonDistributionInfoSchema
>;

export type OnUpdateDistribution<T extends CommonDistributionInfoData> = (
  nextData: Partial<T>
) => void;

export type DistributionPropertiesProps<T extends CommonDistributionInfoData> =
  {
    data: T;
    onChange: OnUpdateDistribution<T>;
  };

export type DistributionInfo<T extends CommonDistributionInfoData> = {
  schema: z.ZodType<T>;
  defaultConfig: T;
  checkType: (distribution: CommonDistributionInfoData) => distribution is T;
  DistributionNodeContent: React.ComponentType<{ data: T }>;
  DistributionPreviewContent: React.ComponentType<{ data: T }>;
  DistributionProperties: React.ComponentType<DistributionPropertiesProps<T>>;
};
