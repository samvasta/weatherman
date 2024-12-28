import { z } from "zod";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  type AnyDistributionData,
  AnyDistributionSchema,
  DistributionType,
  isAsymmetricNormal,
  isChoice,
  isConstant,
  isLaplace,
  isNormal,
  isUniform,
} from "@/types/distributions";
import {
  AsymmetricNormalDistribution,
  AsymmetricNormalDistributionPreview,
  AsymmetricNormalDistributionProperties,
} from "@/types/distributions/impl/asymmetric_normal";
import {
  ChoiceDistribution,
  ChoiceDistributionPreview,
  ChoiceDistributionProperties,
} from "@/types/distributions/impl/choice";
import {
  ConstantDistribution,
  ConstantDistributionPreview,
  ConstantDistributionProperties,
} from "@/types/distributions/impl/constant";
import {
  LaplaceDistribution,
  LaplaceDistributionPreview,
  LaplaceDistributionProperties,
} from "@/types/distributions/impl/laplace";
import {
  NormalDistribution,
  NormalDistributionPreview,
  NormalDistributionProperties,
} from "@/types/distributions/impl/normal";
import {
  UniformDistribution,
  UniformDistributionPreview,
  UniformDistributionProperties,
} from "@/types/distributions/impl/uniform";

import {
  type CommonVariableInfoData,
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  type VariableInfo,
  type VariablePropertiesProps,
  VariableType,
} from "../common";

const IVarSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.IVar).default(VariableType.IVar),

  distribution: AnyDistributionSchema,
});

export type IVarData = z.TypeOf<typeof IVarSchema>;

function useDistributionContent(
  distribution: AnyDistributionData
): React.ReactNode {
  if (isConstant(distribution)) {
    return <ConstantDistribution data={distribution} />;
  }
  if (isUniform(distribution)) {
    return <UniformDistribution data={distribution} />;
  }
  if (isNormal(distribution)) {
    return <NormalDistribution data={distribution} />;
  }
  if (isAsymmetricNormal(distribution)) {
    return <AsymmetricNormalDistribution data={distribution} />;
  }
  if (isLaplace(distribution)) {
    return <LaplaceDistribution data={distribution} />;
  }
  if (isChoice(distribution)) {
    return <ChoiceDistribution data={distribution} />;
  }

  throw new Error(
    "Unrecognized distribution type: " + JSON.stringify(distribution)
  );
}

export function IVarNode({ data }: { data: IVarData }) {
  const Content = useDistributionContent(data.distribution);
  return (
    <div className="flex flex-col px-6 py-3">
      <CommonVariableInfo info={data} />
      {Content}
    </div>
  );
}

function useDistributionPreviewContent(
  distribution: AnyDistributionData
): React.ReactNode {
  if (isConstant(distribution)) {
    return <ConstantDistributionPreview data={distribution} />;
  }
  if (isUniform(distribution)) {
    return <UniformDistributionPreview data={distribution} />;
  }
  if (isNormal(distribution)) {
    return <NormalDistributionPreview data={distribution} />;
  }
  if (isAsymmetricNormal(distribution)) {
    return <AsymmetricNormalDistributionPreview data={distribution} />;
  }
  if (isLaplace(distribution)) {
    return <LaplaceDistributionPreview data={distribution} />;
  }
  if (isChoice(distribution)) {
    return <ChoiceDistributionPreview data={distribution} />;
  }

  throw new Error(
    "Unrecognized distribution type: " + JSON.stringify(distribution)
  );
}
function useDistributionPropertiesContent(
  key: string,
  distribution: AnyDistributionData,
  onChange: (data: AnyDistributionData) => void
): React.ReactNode {
  if (isConstant(distribution)) {
    return (
      <ConstantDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }
  if (isUniform(distribution)) {
    return (
      <UniformDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }
  if (isNormal(distribution)) {
    return (
      <NormalDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }
  if (isAsymmetricNormal(distribution)) {
    return (
      <AsymmetricNormalDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }
  if (isLaplace(distribution)) {
    return (
      <LaplaceDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }
  if (isChoice(distribution)) {
    return (
      <ChoiceDistributionProperties
        data={distribution}
        onChange={onChange}
        key={key}
      />
    );
  }

  throw new Error(
    "Unrecognized distribution type: " + JSON.stringify(distribution)
  );
}
export function IVarNodePreview({ data }: { data: IVarData }) {
  const Content = useDistributionPreviewContent(data.distribution);
  return <div className="flex items-center gap-2 px-2 py-1 ">{Content}</div>;
}

export function IVarProperties({
  data,
  onChange,
}: VariablePropertiesProps<IVarData>) {
  const content = useDistributionPropertiesContent(
    data.ui.id,
    data.distribution,
    (data) => {
      onChange({
        distribution: data,
      });
    }
  );

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      {content}
    </WithCommonProperties>
  );
}

export const IVarInfo: VariableInfo<IVarData> = {
  checkType: (v: CommonVariableInfoData): v is IVarData => {
    return v.type === VariableType.IVar;
  },
  schema: IVarSchema as z.ZodSchema<IVarData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "sum",
    type: VariableType.IVar,
    distribution: {
      type: DistributionType.Constant,
      value: 1,
    },
  },
  hasOutput: true,
  getInputs: (sum) => ({}),
  getPorts: (sum) => [],
  VariableContent: IVarNode,
  VariablePreviewContent: IVarNodePreview,
  VariableProperties: IVarProperties,
};
