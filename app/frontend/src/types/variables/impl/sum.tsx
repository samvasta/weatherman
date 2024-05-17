import { Plus } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";

import { getCompiledModelAtom, nodeNameToIdAtom } from "@/canvas/atoms";
import { OUTPUT_PORT_NAME } from "@/canvas/useNodesAndEdges";
import {
  SelectItemData,
  SimpleSelect,
} from "@/components/primitives/select/SimpleSelect";
import { Txt } from "@/components/primitives/text/Text";
import { useAtomValue } from "jotai";
import { Connection, useStore } from "reactflow";
import {
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  VariableType,
  type CommonVariableInfoData,
  type VariableInfo,
  type VariablePropertiesProps,
} from "../common";

const SumSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Sum).default(VariableType.Sum),

  inputs: z.array(z.string().min(1)).min(1, "At least 1 input is required"),
});

export type SumData = z.TypeOf<typeof SumSchema>;

export function SumNode({ data }: { data: SumData }) {
  return (
    <WithLeftNodeIcon IconComponent={Plus}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function SumNodePreview({ data }: { data: SumData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={Plus}>
      <Heading size="sm">Sum</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function SumProperties({
  data,
  onChange,
}: VariablePropertiesProps<SumData>) {
  const model = useAtomValue(getCompiledModelAtom);
  const { isValidConnection, onConnect } = useStore((state) => ({
    isValidConnection: state.isValidConnection ?? (() => true),
    onConnect: state.onConnect ?? (() => {}),
  }));

  const nameToIdMap = useAtomValue(nodeNameToIdAtom);

  const inputs = model.variables
    .filter((v) => {
      return isValidConnection({
        source: nameToIdMap[v.name]!,
        sourceHandle: `${nameToIdMap[v.name]!}-${OUTPUT_PORT_NAME}`,
        target: data.ui.id,
        targetHandle: `${data.ui.id}-inputs`,
      } as Connection);
    })
    .map<SelectItemData<{ id: string; name: string; enabled: boolean }>>(
      (v) => ({
        label: v.name,
        value: { id: v.ui.id, name: v.name, enabled: v.ui.id !== data.ui.id },
      })
    );

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Sum</Heading>

      {data.inputs.map((input, idx) => (
        <SimpleSelect
          items={inputs}
          selectedId={nameToIdMap[input] || ""}
          onSelect={({ name }) => {
            onChange({
              ...data,
              inputs: [
                ...data.inputs.slice(0, idx),
                name,
                ...data.inputs.slice(idx + 1),
              ],
            });
          }}
        />
      ))}

      <Txt>Add input</Txt>

      <SimpleSelect
        items={inputs}
        selectedId={""}
        onSelect={({ name }) => {
          onConnect({
            source: nameToIdMap[name]!,
            sourceHandle: `${nameToIdMap[name]!}-${OUTPUT_PORT_NAME}`,
            target: data.ui.id,
            targetHandle: `${data.ui.id}-inputs`,
          });
        }}
      />
    </WithCommonProperties>
  );
}

export const SumInfo: VariableInfo<SumData> = {
  checkType: (v: CommonVariableInfoData): v is SumData => {
    return v.type === VariableType.Sum;
  },
  schema: SumSchema as z.ZodSchema<SumData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "sum",
    type: VariableType.Sum,
    inputs: [],
  },
  hasOutput: true,
  getInputs: (sum) =>
    sum.inputs.reduce(
      (map, input) => {
        map["inputs"].push(input);
        return map;
      },
      { inputs: [] as string[] }
    ),
  getPorts: (sum) => [
    {
      name: "inputs",
      connectionStrategy: "append",
    },
  ],
  VariableContent: SumNode,
  VariablePreviewContent: SumNodePreview,
  VariableProperties: SumProperties,
};
