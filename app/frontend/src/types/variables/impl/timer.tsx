import { Timer } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";

import { Txt } from "@/components/primitives/text/Text";
import {
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  VariableType,
  type CommonVariableInfoData,
  type VariableInfo,
  type VariablePropertiesProps,
} from "../common";

const TimerSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Timer).default(VariableType.Timer),

  defaultInput: z.string().min(1),
  timeRanges: z.array(
    z.object({
      input: z.string().min(1),
      startStep: z.number().int().nonnegative(),
    })
  ),
});

export type TimerData = z.TypeOf<typeof TimerSchema>;

export function TimerNode({ data }: { data: TimerData }) {
  return (
    <WithLeftNodeIcon IconComponent={Timer}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function TimerNodePreview({ data }: { data: TimerData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Timer}>
      <Heading size="md">Timer</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function TimerProperties({
  data,
  onChange,
}: VariablePropertiesProps<TimerData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Time Ranges</Heading>
      <Txt intent="subtle">
        Change which input is used at different steps of the simulation.
      </Txt>

      <div className=""></div>
    </WithCommonProperties>
  );
}

export const TimerInfo: VariableInfo<TimerData> = {
  checkType: (v: CommonVariableInfoData): v is TimerData => {
    return v.type === VariableType.Timer;
  },
  schema: TimerSchema as z.ZodSchema<TimerData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "timer",
    type: VariableType.Timer,
    defaultInput: "",
    timeRanges: [],
  },
  hasOutput: true,
  getInputs: (timer) => ({
    default: [timer.defaultInput],
    timers: timer.timeRanges
      .filter((tr) => tr.startStep >= 0)
      .map((tr) => tr.input),
  }),
  getPorts: (timer) => [
    {
      name: "default",
      connectionStrategy: "overwrite",
    },
    {
      name: "timers",
      connectionStrategy: "append",
    },
  ],
  VariableContent: TimerNode,
  VariablePreviewContent: TimerNodePreview,
  VariableProperties: TimerProperties,
};
