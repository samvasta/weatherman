import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { LessOrEqualIcon } from "@/components/icons/lessOrEqualIcon";

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

const LessOrEqualSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.LessOrEqual).default(VariableType.LessOrEqual),

  testA: z.string().min(1, `The "test A" input is missing.`),
  testB: z.string().min(1, `The "test B" input is missing.`),

  true: z.string().min(1, `The "true" input is missing.`),
  false: z.string().min(1, `The "false" input is missing.`),
});

export type LessOrEqualData = z.TypeOf<typeof LessOrEqualSchema>;

export function LessOrEqualNode({ data }: { data: LessOrEqualData }) {
  return (
    <WithLeftNodeIcon IconComponent={LessOrEqualIcon}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function LessOrEqualNodePreview({ data }: { data: LessOrEqualData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={LessOrEqualIcon}>
      <Heading size="sm">Less Than Or Equal</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function LessOrEqualProperties({
  data,
  onChange,
}: VariablePropertiesProps<LessOrEqualData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Less Than Or Equal</Heading>
    </WithCommonProperties>
  );
}

export const LessOrEqualInfo: VariableInfo<LessOrEqualData> = {
  checkType: (v: CommonVariableInfoData): v is LessOrEqualData => {
    return v.type === VariableType.LessOrEqual;
  },
  schema: LessOrEqualSchema as z.ZodSchema<LessOrEqualData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "less or equal",
    type: VariableType.LessOrEqual,
    testA: "",
    testB: "",
    true: "",
    false: "",
  },
  hasOutput: true,
  getInputs: (lessOrEqual) => ({
    testA: singleToList(lessOrEqual.testA),
    testB: singleToList(lessOrEqual.testB),
    true: singleToList(lessOrEqual.true),
    false: singleToList(lessOrEqual.false),
  }),
  getPorts: (_equals) => [
    { name: "testA", connectionStrategy: "overwrite" },
    { name: "testB", connectionStrategy: "overwrite" },
    { name: "true", connectionStrategy: "overwrite" },
    { name: "false", connectionStrategy: "overwrite" },
  ],
  VariableContent: LessOrEqualNode,
  VariablePreviewContent: LessOrEqualNodePreview,
  VariableProperties: LessOrEqualProperties,
};
