import { LineChart } from "lucide-react";
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

const CollectorSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Collector).default(VariableType.Collector),

  input: z.string().min(1),
  target: z.string().nullable(),
});

export type CollectorData = z.TypeOf<typeof CollectorSchema>;

export function CollectorNode({ data }: { data: CollectorData }) {
  return (
    <WithLeftNodeIcon IconComponent={LineChart}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function CollectorNodePreview({ data }: { data: CollectorData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={LineChart}>
      <Heading size="md">Collector</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function CollectorProperties({
  data,
  onChange,
}: VariablePropertiesProps<CollectorData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Collector</Heading>
    </WithCommonProperties>
  );
}

export const CollectorInfo: VariableInfo<CollectorData> = {
  checkType: (v: CommonVariableInfoData): v is CollectorData => {
    return v.type === VariableType.Collector;
  },
  schema: CollectorSchema as z.ZodSchema<CollectorData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "collector",
    type: VariableType.Collector,
    input: "",
    target: "",
  },
  hasOutput: false,
  getInputs: (collector) => ({ input: singleToList(collector.input) }),
  getPorts: (collector) => [{ name: "input", connectionStrategy: "overwrite" }],
  VariableContent: CollectorNode,
  VariablePreviewContent: CollectorNodePreview,
  VariableProperties: CollectorProperties,
};
