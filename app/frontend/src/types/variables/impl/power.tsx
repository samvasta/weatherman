import { Superscript } from "lucide-react";
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
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  VariableType,
  type CommonVariableInfoData,
  type VariableInfo,
  type VariablePropertiesProps,
} from "../common";

const PowerSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Power).default(VariableType.Power),

  base: z.string().min(1, `The "base" input is missing.`),
  exponent: z.string().min(1, `The "exponent" input is missing.`),
});

export type PowerData = z.TypeOf<typeof PowerSchema>;

export function PowerNode({ data }: { data: PowerData }) {
  return (
    <WithLeftNodeIcon IconComponent={Superscript}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function PowerNodePreview({ data }: { data: PowerData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Superscript}>
      <Heading size="sm">Power</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function PowerProperties({
  data,
  onChange,
}: VariablePropertiesProps<PowerData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Power</Heading>
    </WithCommonProperties>
  );
}

export const PowerInfo: VariableInfo<PowerData> = {
  checkType: (v: CommonVariableInfoData): v is PowerData => {
    return v.type === VariableType.Power;
  },
  schema: PowerSchema as z.ZodSchema<PowerData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "power",
    type: VariableType.Power,
    base: "",
    exponent: "",
  },
  hasOutput: true,
  getInputs: (power) => ({
    exponent: singleToList(power.exponent),
    base: singleToList(power.base),
  }),
  getPorts: (power) => [
    { name: "base", connectionStrategy: "overwrite" },
    { name: "exponent", connectionStrategy: "overwrite" },
  ],
  VariableContent: PowerNode,
  VariablePreviewContent: PowerNodePreview,
  VariableProperties: PowerProperties,
};
