import { ArrowDownRight, ArrowDownUp } from "lucide-react";
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
import {
  NodeResizeControl,
  useNodes,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { CheckboxWithLabel } from "@/components/primitives/checkbox/Checkbox";
import { VariableNodeType } from "@/canvas/useNodesAndEdges";
import React from "react";
import { AnyVariableData } from "../allVariables";
import { graphToModel } from "@/canvas/graphToModel";
import { useSetAtom } from "jotai";
import { setCompiledModelAtom } from "@/canvas/atoms";
import { useOnUpdateNode } from "@/canvas/useOnUpdateNode";
import { SimpleSelect } from "@/components/primitives/select/SimpleSelect";
import { Txt } from "@/components/primitives/text/Text";

const RegionSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Region).default(VariableType.Region),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  layer: z.union([
    z.literal(11),
    z.literal(10),
    z.literal(9),
    z.literal(8),
    z.literal(7),
    z.literal(6),
    z.literal(5),
    z.literal(4),
    z.literal(3),
    z.literal(2),
    z.literal(1),
  ]),
  locked: z.boolean(),
});

export type RegionData = z.TypeOf<typeof RegionSchema>;

const layerToSwatch = {
  [11]: "#DC64E8",
  [10]: "#8A70FA",
  [9]: "#5BA5F2",
  [8]: "#58DBF1",
  [7]: "#42DDC5",
  [6]: "#5BDE62",
  [5]: "#DFDB26",
  [4]: "#F4A940",
  [3]: "#EE6151",
  [2]: "#875D36",
  [1]: "#969696",
};
export function RegionNode({ data }: { data: RegionData }) {
  const { onUpdateNode, node } = useOnUpdateNode(data);

  return (
    <>
      {!data.locked && (
        <NodeResizeControl
          onResize={(e, p) =>
            onUpdateNode(
              {
                ...data,
                width: p.width,
                height: p.height,
                ui: {
                  ...data.ui,
                  x: p.x,
                  y: p.y,
                },
              },
              {
                width: p.width,
                height: p.height,
                position: {
                  x: p.x,
                  y: p.y,
                },
              }
            )
          }
        >
          <ArrowDownRight className="text-neutral-11 w-4 h-4" />
        </NodeResizeControl>
      )}
      <div
        style={{
          backgroundColor: `${layerToSwatch[data.layer]}22`,
          width: `${data.width}px`,
          height: `${data.height}px`,
          borderWidth: node?.selected ? 2 : 0,
          borderColor: layerToSwatch[data.layer],
        }}
        className="p-regular"
      >
        <Heading size="lg">{data.name}</Heading>
      </div>
    </>
  );
}

export function RegionNodePreview({ data }: { data: RegionData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={ArrowDownUp}>
      <Heading size="md">Region</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function RegionProperties({
  data,
  onChange,
}: VariablePropertiesProps<RegionData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Region</Heading>

      <CheckboxWithLabel
        colorScheme="primary"
        checked={data.locked}
        onCheckedChange={(checked) =>
          onChange(
            {
              ...data,
              locked: checked === true,
            },
            {
              draggable: checked !== true,
            }
          )
        }
      >
        Lock size and position
      </CheckboxWithLabel>

      <SimpleSelect
        items={Object.entries(layerToSwatch).map(([layer, color]) => ({
          label: `Layer ${layer}`,
          value: { id: layer },
        }))}
        renderItem={(item) => {
          return (
            <div className="flex gap-xtight items-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    layerToSwatch[
                      Number(item.id) as keyof typeof layerToSwatch
                    ],
                }}
              />
              <Txt>Layer {item.id}</Txt>
            </div>
          );
        }}
        selectedId={data.layer.toString()}
        onSelect={({ id }) => {
          onChange(
            {
              ...data,
              layer: Number(id) as RegionData["layer"],
            },
            {
              zIndex: Number(id),
            }
          );
        }}
      />
    </WithCommonProperties>
  );
}

export const RegionInfo: VariableInfo<RegionData> = {
  checkType: (v: CommonVariableInfoData): v is RegionData => {
    return v.type === VariableType.Region;
  },
  schema: RegionSchema as z.ZodSchema<RegionData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "region",
    type: VariableType.Region,
    width: 600,
    height: 300,
    layer: 1,
    locked: false,
  },
  hasOutput: false,
  getInputs: (region) => ({}),
  getPorts: (region) => [],
  VariableContent: RegionNode,
  VariablePreviewContent: RegionNodePreview,
  VariableProperties: RegionProperties,
};
