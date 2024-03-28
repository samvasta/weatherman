import { ArrowDownUp } from "lucide-react";
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

const InvertSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Invert).default(VariableType.Invert),

  input: z.string().min(1, `The input is missing.`),
});

export type InvertData = z.TypeOf<typeof InvertSchema>;

export function InvertNode({ data }: { data: InvertData }) {
  return (
    <WithLeftNodeIcon IconComponent={ArrowDownUp}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function InvertNodePreview({ data }: { data: InvertData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={ArrowDownUp}>
      <Heading size="md">Invert</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function InvertProperties({
  data,
  onChange,
}: VariablePropertiesProps<InvertData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Invert</Heading>
    </WithCommonProperties>
  );
}

export const InvertInfo: VariableInfo<InvertData> = {
  checkType: (v: CommonVariableInfoData): v is InvertData => {
    return v.type === VariableType.Invert;
  },
  schema: InvertSchema as z.ZodSchema<InvertData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "invert",
    type: VariableType.Invert,
    input: "",
  },
  hasOutput: true,
  getInputs: (invert) => ({
    input: singleToList(invert.input),
  }),
  getPorts: (invert) => [{ name: "input", connectionStrategy: "overwrite" }],
  VariableContent: InvertNode,
  VariablePreviewContent: InvertNodePreview,
  VariableProperties: InvertProperties,
};
