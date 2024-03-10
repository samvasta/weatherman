import React from "react";

import { Heading } from "@/components/primitives/text/Heading";

import { ChoiceIcon } from "@/components/icons/distributions/ChoiceIcon";
import { ConstantIcon } from "@/components/icons/distributions/ConstantIcon";
import { NormalIcon } from "@/components/icons/distributions/NormalIcon";
import { UniformIcon } from "@/components/icons/distributions/UniformIcon";

import {
  type AnyDistributionData,
  type ChoiceData,
  type ConstantData,
  type NormalData,
  type UniformData,
  isChoice,
  isConstant,
  isNormal,
  isUniform,
} from "@/types/distributions";
import { type IVarData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function IVarNode({ data }: { data: IVarData }) {
  const Content = useDistributionContent(data.distribution);
  return (
    <>
      <CommonVariableInfo info={data} />
      {Content}
    </>
  );
}

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
  if (isChoice(distribution)) {
    return <ChoiceDistribution data={distribution} />;
  }

  throw new Error(
    "Unrecognized distribution type: " + JSON.stringify(distribution)
  );
}

function ConstantDistribution({ data }: { data: ConstantData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">{data.value}</Heading>
      <ConstantIcon label="Constant" size="xl" className="text-neutral-10" />
    </div>
  );
}

function UniformDistribution({ data }: { data: UniformData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.min} - {data.max}
      </Heading>
      <UniformIcon label="Uniform" size="xl" className="text-neutral-10" />
    </div>
  );
}
function NormalDistribution({ data }: { data: NormalData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.mean} ({data.stdDev}σ)
      </Heading>
      <NormalIcon label="Normal" size="xl" className="text-neutral-10" />
    </div>
  );
}
function ChoiceDistribution({ data }: { data: ChoiceData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">{data.options.join(", ")}</Heading>
      <ChoiceIcon label="Choice" size="xl" className="text-neutral-10" />
    </div>
  );
}
