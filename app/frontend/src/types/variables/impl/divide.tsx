import { Divide } from "lucide-react";
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

const DivideSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Divide).default(VariableType.Divide),

  dividend: z.string().min(1, `The "dividend" input is missing.`),
  divisor: z.string().min(1, `The "divisor" input is missing.`),
});

export type DivideData = z.TypeOf<typeof DivideSchema>;

export function DivideNode({ data }: { data: DivideData }) {
  return (
    <WithLeftNodeIcon IconComponent={Divide}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function DivideNodePreview({ data }: { data: DivideData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Divide}>
      <Heading size="md">Divide</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function DivideProperties({
  data,
  onChange,
}: VariablePropertiesProps<DivideData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Divide</Heading>
    </WithCommonProperties>
  );
}

export const DivideInfo: VariableInfo<DivideData> = {
  checkType: (v: CommonVariableInfoData): v is DivideData => {
    return v.type === VariableType.Divide;
  },
  schema: DivideSchema as z.ZodSchema<DivideData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "divide",
    type: VariableType.Divide,
    dividend: "",
    divisor: "",
  },
  hasOutput: true,
  getInputs: (divide) => ({
    dividend: singleToList(divide.dividend),
    divisor: singleToList(divide.divisor),
  }),
  getPorts: (divide) => [
    { name: "dividend", connectionStrategy: "overwrite" },
    { name: "divisor", connectionStrategy: "overwrite" },
  ],
  VariableContent: DivideNode,
  VariablePreviewContent: DivideNodePreview,
  VariableProperties: DivideProperties,
};
