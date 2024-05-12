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
import { useAtomValue } from "jotai";
import { useEdges } from "reactflow";
import { getCompiledModelAtom } from "@/canvas/atoms";
import React from "react";
import {
  SelectItemData,
  SimpleSelect,
} from "@/components/primitives/select/SimpleSelect";
import { NumberInput } from "@/components/primitives/input/Input";
import { Button } from "@/components/primitives/button/Button";

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
  const model = useAtomValue(getCompiledModelAtom);
  const edges = useEdges();

  const inputs = React.useMemo(() => {
    const incomingNodes = edges
      .filter((e) => e.target === data.ui.id)
      .map((e) => e.source);

    return model.variables
      .filter((v) => v.ui.id !== data.ui.id)
      .filter((v) => incomingNodes.includes(v.ui.id))
      .map<SelectItemData<{ id: string; name: string }>>((v) => ({
        label: v.name,
        value: { id: v.ui.id, name: v.name },
      }));
  }, [model.variables, data.ui.id, edges]);

  const sortedRanges = [...data.timeRanges];
  sortedRanges.sort((a, b) => a.startStep - b.startStep);

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Time Ranges</Heading>
      <Txt intent="subtle">
        Change which input is used at different steps of the simulation.
      </Txt>
      <div className="grid grid-cols-[minmax(min-content,_8rem)_auto] gap-x-tight gap-y-0">
        <SimpleSelect
          items={inputs}
          selectedId={
            inputs.find((v) => v.value.name === data.defaultInput)?.value.id ||
            ""
          }
          onSelect={({ name }) => {
            onChange({
              ...data,
              defaultInput: name ?? null,
            });
          }}
          trigger={{
            style: {
              gridRow: 1,
              gridColumn: 2,
            },
            className: "h-min place-self-center",
          }}
        />
        {data.timeRanges.map((input, i) => {
          const row = data.timeRanges.filter(
            (tr, j) =>
              (i > j && tr.startStep === input.startStep) ||
              tr.startStep < input.startStep
          ).length;
          return (
            <React.Fragment key={`input-${i}`}>
              <NumberInput
                style={{
                  gridRow: 2 * row + 2,
                  gridColumn: 1,
                }}
                variant="flushed"
                className="h-min"
                value={input.startStep}
                onChange={(nextValue) => {
                  onChange({
                    ...data,
                    timeRanges: data.timeRanges.map((dInput, dI) => {
                      if (dI === i) {
                        return {
                          input: input.input,
                          startStep: nextValue,
                        };
                      }
                      return dInput;
                    }),
                  });
                }}
              />
              <div
                style={{
                  gridRow: 2 * row + 3,
                  gridColumn: 1,
                }}
                className="h-10 w-[2px] bg-primary-10 place-self-end mr-regular"
              ></div>
              <SimpleSelect
                trigger={{
                  style: {
                    gridRow: 2 * row + 3,
                    gridColumn: 2,
                  },
                  className: "h-min place-self-center",
                }}
                items={inputs}
                selectedId={
                  inputs.find((v) => v.value.name === input.input)?.value.id ||
                  ""
                }
                onSelect={({ name }) => {
                  onChange({
                    ...data,
                    timeRanges: data.timeRanges.map((dInput, dI) => {
                      if (dI === i) {
                        return {
                          input: name,
                          startStep: input.startStep,
                        };
                      }
                      return dInput;
                    }),
                  });
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      <Button
        colorScheme="neutral"
        onClick={() =>
          onChange({
            ...data,
            timeRanges: data.timeRanges.concat([
              {
                input: "",
                startStep:
                  (sortedRanges[sortedRanges.length - 1]?.startStep || 0) + 1,
              },
            ]),
          })
        }
      >
        Add time range
      </Button>
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
    inputs: [timer.defaultInput, ...timer.timeRanges.map((tr) => tr.input)],
  }),
  getPorts: (timer) => [
    {
      name: "inputs",
      connectionStrategy: "append",
    },
  ],
  VariableContent: TimerNode,
  VariablePreviewContent: TimerNodePreview,
  VariableProperties: TimerProperties,
};
