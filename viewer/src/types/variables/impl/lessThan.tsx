import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { LessThanIcon } from "@/components/icons/lessThanIcon";

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

const LessThanSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.LessThan).default(VariableType.LessThan),

  testA: z.string().min(1, `The "test A" input is missing.`),
  testB: z.string().min(1, `The "test B" input is missing.`),

  true: z.string().min(1, `The "true" input is missing.`),
  false: z.string().min(1, `The "false" input is missing.`),
});

export type LessThanData = z.TypeOf<typeof LessThanSchema>;

export function LessThanNode({ data }: { data: LessThanData }) {
  return (
    <WithLeftNodeIcon IconComponent={LessThanIcon}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function LessThanNodePreview({ data }: { data: LessThanData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={LessThanIcon}>
      <Heading size="md">LessThan</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function LessThanProperties({
  data,
  onChange,
}: VariablePropertiesProps<LessThanData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">LessThan</Heading>
    </WithCommonProperties>
  );
}

export const LessThanInfo: VariableInfo<LessThanData> = {
  checkType: (v: CommonVariableInfoData): v is LessThanData => {
    return v.type === VariableType.LessThan;
  },
  schema: LessThanSchema as z.ZodSchema<LessThanData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "less than",
    type: VariableType.LessThan,
    testA: "",
    testB: "",
    true: "",
    false: "",
  },
  hasOutput: true,
  getInputs: (lessThan) => ({
    testA: singleToList(lessThan.testA),
    testB: singleToList(lessThan.testB),
    true: singleToList(lessThan.true),
    false: singleToList(lessThan.false),
  }),
  getPorts: (_equals) => [
    { name: "testA", connectionStrategy: "overwrite" },
    { name: "testB", connectionStrategy: "overwrite" },
    { name: "true", connectionStrategy: "overwrite" },
    { name: "false", connectionStrategy: "overwrite" },
  ],
  VariableContent: LessThanNode,
  VariablePreviewContent: LessThanNodePreview,
  VariableProperties: LessThanProperties,
};
