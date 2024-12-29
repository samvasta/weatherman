import React from "react";

import { useAtomValue } from "jotai";
import { LineChart } from "lucide-react";
import { z } from "zod";

import {
  type SelectItemData,
  SimpleSelect,
} from "@/components/primitives/select/SimpleSelect";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";
import { getCompiledModelAtom } from "@/state/model.atoms";
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

  input: z.string().min(1, `The input is missing.`),
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
      <Heading size="sm">Collector</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function CollectorProperties({
  data,
  onChange,
}: VariablePropertiesProps<CollectorData>) {
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
      <Heading size="sm">Carry value to</Heading>
      <Txt intent="subtle">
        Optionally set an input which will inherit this collector&apos;s value
        after each time step. This will overwrite the value of the input with
        the value from this collector.
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
    </WithCommonProperties>
  );
}

function isCollector(v: CommonVariableInfoData): v is CollectorData {
  return v.type === VariableType.Collector;
}

export const CollectorInfo: VariableInfo<CollectorData> = {
  checkType: isCollector,
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
