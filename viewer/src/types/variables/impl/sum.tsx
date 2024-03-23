import { Plus } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";

import {
  type CommonVariableInfoData,
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  type VariableInfo,
  type VariablePropertiesProps,
  VariableType,
} from "../common";

const SumSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Sum).default(VariableType.Sum),

  inputs: z.array(z.string().min(1)).min(1, "At least 1 input is required"),
});

export type SumData = z.TypeOf<typeof SumSchema>;

export function SumNode({ data }: { data: SumData }) {
  return (
    <WithLeftNodeIcon IconComponent={Plus}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function SumNodePreview({ data }: { data: SumData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Plus}>
      <Heading size="md">Sum</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function SumProperties({
  data,
  onChange,
}: VariablePropertiesProps<SumData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Sum</Heading>
    </WithCommonProperties>
  );
}

export const SumInfo: VariableInfo<SumData> = {
  checkType: (v: CommonVariableInfoData): v is SumData => {
    return v.type === VariableType.Sum;
  },
  schema: SumSchema as z.ZodSchema<SumData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "sum",
    type: VariableType.Sum,
    inputs: [],
  },
  hasOutput: true,
  getInputs: (sum) =>
    sum.inputs.reduce(
      (map, input) => {
        map["inputs"].push(input);
        return map;
      },
      { inputs: [] as string[] }
    ),
  getPorts: (sum) => [
    {
      name: "inputs",
      connectionStrategy: "append",
    },
  ],
  VariableContent: SumNode,
  VariablePreviewContent: SumNodePreview,
  VariableProperties: SumProperties,
};
