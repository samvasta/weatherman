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
import { Label } from "@/components/primitives/label/Label";
import {
  SelectItemData,
  SimpleSelect,
} from "@/components/primitives/select/SimpleSelect";
import { Txt } from "@/components/primitives/text/Text";
import { useAtomValue } from "jotai";
import React from "react";
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

  defaultInput: z.string().min(1),
  selectorInput: z.string().min(1),
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
      <Heading size="md">Multiplexer</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function MultiplexerProperties({
  data,
  onChange,
}: VariablePropertiesProps<MultiplexerData>) {
  const model = useAtomValue(getCompiledModelAtom);

  const ivars = React.useMemo(() => {
    const allIVars = model.variables.filter(
      (v) => v.type === VariableType.IVar
    );

    const linkedIVarNames = model.variables
      .filter(isCollector)
      .filter((v) => v.ui.id !== data.ui.id)
      .map((v) => v.target)
      .filter(Boolean);

    return [
      {
        label: "(None)",
        value: { id: "", name: "" },
      },
      ...allIVars
        .filter((v) => !linkedIVarNames.includes(v.name))
        .map<
          SelectItemData<{ id: string; name: string }>
        >((v) => ({ label: v.name, value: { id: v.ui.id, name: v.name } })),
    ];
  }, [model.variables, data.ui.id]);

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Multiplexed Inputs</Heading>

      <Label>Selector</Label>
      <Txt intent="subtle">
        The multiplexer will choose an output depending on the value of the
        selector input.
      </Txt>
      <SimpleSelect
        items={ivars}
        selectedId={
          ivars.find((v) => v.value.name === data.target)?.value.id || ""
        }
        onSelect={({ name }) => {
          onChange({
            ...data,
            target: name ?? null,
          });
        }}
      />

      <Heading size="sm">Multiplexed Inputs</Heading>

      <Label>Default Output</Label>
      <Txt intent="subtle">
        The multiplexer will use this value if none of the other inputs match
        the selector.
      </Txt>
      <SimpleSelect
        items={ivars}
        selectedId={
          ivars.find((v) => v.value.name === data.target)?.value.id || ""
        }
        onSelect={({ name }) => {
          onChange({
            ...data,
            target: name ?? null,
          });
        }}
      />

      <Txt intent="subtle">
        The multiplexer will output one of these inputs depending on the value
        of the selector input.
      </Txt>

      <div className=""></div>
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
    selectorInput: "",
    defaultInput: "",
    muxInputs: [],
  },
  hasOutput: true,
  getInputs: (multiplexer) => ({
    selector: [multiplexer.selectorInput],
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
