import { CircuitBoard } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";

import { getCompiledModelAtom } from "@/canvas/atoms";
import { Button } from "@/components/primitives/button/Button";
import { NumberInput } from "@/components/primitives/input/Input";
import { Label } from "@/components/primitives/label/Label";
import {
  SelectItemData,
  SimpleSelect,
} from "@/components/primitives/select/SimpleSelect";
import { Txt } from "@/components/primitives/text/Text";
import { singleToList } from "@/utils/singleToList";
import { useAtomValue } from "jotai";
import React from "react";
import { useEdges } from "reactflow";
import {
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  VariableType,
  type CommonVariableInfoData,
  type VariableInfo,
  type VariablePropertiesProps,
} from "../common";

const MultiplexerSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Multiplexer).default(VariableType.Multiplexer),

  defaultInput: z.string().min(1, "Must select a default input"),
  selector: z.string().min(1, "Must provide a selector"),
  muxInputs: z.array(
    z.object({
      input: z.string().min(1),
      minValue: z.number(),
    })
  ),
});

export type MultiplexerData = z.TypeOf<typeof MultiplexerSchema>;

export function MultiplexerNode({ data }: { data: MultiplexerData }) {
  return (
    <WithLeftNodeIcon IconComponent={CircuitBoard}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function MultiplexerNodePreview({ data }: { data: MultiplexerData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={CircuitBoard}>
      <Heading size="sm">Multiplexer</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function MultiplexerProperties({
  data,
  onChange,
}: VariablePropertiesProps<MultiplexerData>) {
  const model = useAtomValue(getCompiledModelAtom);
  const edges = useEdges();

  const inputs = React.useMemo(() => {
    const incomingNodes = edges
      .filter(
        (e) =>
          e.target === data.ui.id &&
          !(e.targetHandle || "").includes("selector")
      )
      .map((e) => e.source);

    return model.variables
      .filter((v) => v.ui.id !== data.ui.id)
      .filter((v) => incomingNodes.includes(v.ui.id))
      .map<SelectItemData<{ id: string; name: string }>>((v) => ({
        label: v.name,
        value: { id: v.ui.id, name: v.name },
      }));
  }, [model.variables, data.ui.id, edges]);

  const sortedInputs = [...data.muxInputs];
  sortedInputs.sort((a, b) => a.minValue - b.minValue);

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Multiplexed Inputs</Heading>

      <Label>Selectable Outputs</Label>
      <Txt intent="subtle">
        The multiplexer will output one of these inputs depending on the value
        of the selector input.
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
        {data.muxInputs.map((input, i) => {
          const row = data.muxInputs.filter(
            (tr, j) =>
              (i > j && tr.minValue === input.minValue) ||
              tr.minValue < input.minValue
          ).length;
          return (
            <React.Fragment key={`input-${i}-${input.input}-${input.minValue}`}>
              <NumberInput
                style={{
                  gridRow: 2 * row + 2,
                  gridColumn: 1,
                }}
                variant="flushed"
                className="h-min"
                value={input.minValue}
                onChange={(nextValue) => {
                  onChange({
                    ...data,
                    muxInputs: data.muxInputs.map((dInput, dI) => {
                      if (dI === i) {
                        return {
                          input: input.input,
                          minValue: nextValue,
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
                    muxInputs: data.muxInputs.map((dInput, dI) => {
                      if (dI === i) {
                        return {
                          input: name,
                          minValue: input.minValue,
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
            muxInputs: data.muxInputs.concat([
              {
                input: "",
                minValue:
                  (sortedInputs[sortedInputs.length - 1]?.minValue || 0) + 1,
              },
            ]),
          })
        }
      >
        Add output
      </Button>
    </WithCommonProperties>
  );
}

export const MultiplexerInfo: VariableInfo<MultiplexerData> = {
  checkType: (v: CommonVariableInfoData): v is MultiplexerData => {
    return v.type === VariableType.Multiplexer;
  },
  schema: MultiplexerSchema as z.ZodSchema<MultiplexerData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "multiplexer",
    type: VariableType.Multiplexer,
    selector: "",
    defaultInput: "",
    muxInputs: [],
  },
  hasOutput: true,
  getInputs: (multiplexer) => ({
    selector: singleToList(multiplexer.selector),
    inputs: [
      multiplexer.defaultInput,
      ...multiplexer.muxInputs.map((tr) => tr.input),
    ],
  }),
  getPorts: (multiplexer) => [
    {
      name: "selector",
      connectionStrategy: "overwrite",
    },
    {
      name: "inputs",
      connectionStrategy: "append",
    },
  ],
  VariableContent: MultiplexerNode,
  VariablePreviewContent: MultiplexerNodePreview,
  VariableProperties: MultiplexerProperties,
};
