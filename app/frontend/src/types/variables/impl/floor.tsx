import { ArrowDownToLineIcon } from "lucide-react";
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

const FloorSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Floor).default(VariableType.Floor),

  input: z.string().min(1, `The input is missing.`),
});

export type FloorData = z.TypeOf<typeof FloorSchema>;

export function FloorNode({ data }: { data: FloorData }) {
  return (
    <WithLeftNodeIcon IconComponent={ArrowDownToLineIcon}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function FloorNodePreview({ data }: { data: FloorData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={ArrowDownToLineIcon}>
      <Heading size="sm">Round Down</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function FloorProperties({
  data,
  onChange,
}: VariablePropertiesProps<FloorData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Round Down</Heading>
    </WithCommonProperties>
  );
}

export const FloorInfo: VariableInfo<FloorData> = {
  checkType: (v: CommonVariableInfoData): v is FloorData => {
    return v.type === VariableType.Floor;
  },
  schema: FloorSchema as z.ZodSchema<FloorData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "Round down",
    type: VariableType.Floor,
    input: "",
  },
  hasOutput: true,
  getInputs: (floor) => ({
    input: singleToList(floor.input),
  }),
  getPorts: (floor) => [
    {
      name: "input",
      connectionStrategy: "overwrite",
    },
  ],
  VariableContent: FloorNode,
  VariablePreviewContent: FloorNodePreview,
  VariableProperties: FloorProperties,
};
