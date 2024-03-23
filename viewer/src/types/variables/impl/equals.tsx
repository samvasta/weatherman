import { Equal } from "lucide-react";
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

const EqualsSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Equals).default(VariableType.Equals),

  testA: z.string().min(1),
  testB: z.string().min(1),

  true: z.string().min(1),
  false: z.string().min(1),
});

export type EqualsData = z.TypeOf<typeof EqualsSchema>;

export function EqualsNode({ data }: { data: EqualsData }) {
  return (
    <WithLeftNodeIcon IconComponent={Equal}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function EqualsNodePreview({ data }: { data: EqualsData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Equal}>
      <Heading size="md">Equals</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function EqualsProperties({
  data,
  onChange,
}: VariablePropertiesProps<EqualsData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Equals</Heading>
    </WithCommonProperties>
  );
}

export const EqualsInfo: VariableInfo<EqualsData> = {
  checkType: (v: CommonVariableInfoData): v is EqualsData => {
    return v.type === VariableType.Equals;
  },
  schema: EqualsSchema as z.ZodSchema<EqualsData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "equals",
    type: VariableType.Equals,
    testA: "",
    testB: "",
    true: "",
    false: "",
  },
  hasOutput: true,
  getInputs: (equals) => ({
    testA: singleToList(equals.testA),
    testB: singleToList(equals.testB),
    true: singleToList(equals.true),
    false: singleToList(equals.false),
  }),
  getPorts: (_equals) => [
    { name: "testA", connectionStrategy: "overwrite" },
    { name: "testB", connectionStrategy: "overwrite" },
    { name: "true", connectionStrategy: "overwrite" },
    { name: "false", connectionStrategy: "overwrite" },
  ],
  VariableContent: EqualsNode,
  VariablePreviewContent: EqualsNodePreview,
  VariableProperties: EqualsProperties,
};
