import { z } from "zod";

import { DistributionInfo, DistributionType } from "./common";
import { AsymmetricNormalInfo } from "./impl/asymmetric_normal";
import { ChoiceInfo } from "./impl/choice";
import { ConstantInfo } from "./impl/constant";
import { LaplaceInfo } from "./impl/laplace";
import { NormalInfo } from "./impl/normal";
import { UniformInfo } from "./impl/uniform";

export const AnyDistributionSchema = z.union([
  ConstantInfo.schema,
  UniformInfo.schema,
  NormalInfo.schema,
  AsymmetricNormalInfo.schema,
  LaplaceInfo.schema,
  ChoiceInfo.schema,
]);

export type AnyDistributionData = z.TypeOf<typeof AnyDistributionSchema>;

export const AllDistributions: {
  [t in DistributionType]: DistributionInfo<any>;
} = {
  [DistributionType.AsymmetricNormal]: AsymmetricNormalInfo,
  [DistributionType.Choice]: ChoiceInfo,
  [DistributionType.Constant]: ConstantInfo,
  [DistributionType.Laplace]: LaplaceInfo,
  [DistributionType.Normal]: NormalInfo,
  [DistributionType.Uniform]: UniformInfo,
};
