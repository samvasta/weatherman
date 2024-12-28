import { ArrowUpToLineIcon } from "lucide-react";
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

const CeilSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Ceil).default(VariableType.Ceil),

  input: z.string().min(1, `The input is missing.`),
});

export type CeilData = z.TypeOf<typeof CeilSchema>;

export function CeilNode({ data }: { data: CeilData }) {
  return (
    <WithLeftNodeIcon IconComponent={ArrowUpToLineIcon}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function CeilNodePreview({ data }: { data: CeilData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={ArrowUpToLineIcon}>
      <Heading size="sm">Round Up</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function CeilProperties({
  data,
  onChange,
}: VariablePropertiesProps<CeilData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Round Up</Heading>
    </WithCommonProperties>
  );
}

export const CeilInfo: VariableInfo<CeilData> = {
  checkType: (v: CommonVariableInfoData): v is CeilData => {
    return v.type === VariableType.Ceil;
  },
  schema: CeilSchema as z.ZodSchema<CeilData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "Round Up",
    type: VariableType.Ceil,
    input: "",
  },
  hasOutput: true,
  getInputs: (ceil) => ({
    input: singleToList(ceil.input),
  }),
  getPorts: (ceil) => [
    {
      name: "input",
      connectionStrategy: "overwrite",
    },
  ],
  VariableContent: CeilNode,
  VariablePreviewContent: CeilNodePreview,
  VariableProperties: CeilProperties,
};
