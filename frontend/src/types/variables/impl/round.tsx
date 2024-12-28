import { FoldVerticalIcon } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";
import { singleToList } from "@/utils/singleToList";

import {
  type CommonVariableInfoData,
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  type VariableInfo,
  type VariablePropertiesProps,
  VariableType,
} from "../common";

const RoundSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Round).default(VariableType.Round),

  input: z.string().min(1, `The input is missing.`),
});

export type RoundData = z.TypeOf<typeof RoundSchema>;

export function RoundNode({ data }: { data: RoundData }) {
  return (
    <WithLeftNodeIcon IconComponent={FoldVerticalIcon}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function RoundNodePreview({ data }: { data: RoundData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={FoldVerticalIcon}>
      <Heading size="sm">Round</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function RoundProperties({
  data,
  onChange,
}: VariablePropertiesProps<RoundData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Round</Heading>
    </WithCommonProperties>
  );
}

export const RoundInfo: VariableInfo<RoundData> = {
  checkType: (v: CommonVariableInfoData): v is RoundData => {
    return v.type === VariableType.Round;
  },
  schema: RoundSchema as z.ZodSchema<RoundData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "Round",
    type: VariableType.Round,
    input: "",
  },
  hasOutput: true,
  getInputs: (round) => ({
    input: singleToList(round.input),
  }),
  getPorts: (round) => [
    {
      name: "input",
      connectionStrategy: "overwrite",
    },
  ],
  VariableContent: RoundNode,
  VariablePreviewContent: RoundNodePreview,
  VariableProperties: RoundProperties,
};
