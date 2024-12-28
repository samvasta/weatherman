import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node } from "@xyflow/react";

import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";

export type VariableNodeType = Node<AnyVariableData, "var">;

export type VariableEdgeData = {
  variableInput: string;
};
export type VariableEdgeType = Edge<VariableEdgeData>;

export const OUTPUT_PORT_NAME = "output";

export const PORT_NAME_SEPARATOR = ":";

export function variablesToNodesAndEdges(variables: AnyVariableData[]): {
  nodes: VariableNodeType[];
  edges: VariableEdgeType[];
  nodeNameToId: Record<string, string>;
} {
  const nodes: VariableNodeType[] = [];

  const edges: VariableEdgeType[] = [];

  const nodeNameToId: Record<string, string> = {};

  for (const v of variables) {
    const id = v.ui?.id || nanoid(8);
    nodeNameToId[v.name] = id;
    nodes.push({
      id,
      data: v,
      position: { x: v.ui?.x ?? 0, y: v.ui?.y ?? 0 },
      width: v.type === VariableType.Region ? v.width : 300,
      height: v.type === VariableType.Region ? v.height : 300,
      type: "var",
      zIndex: v.type === VariableType.Region ? v.layer : 20,
      draggable: v.type === VariableType.Region ? !v.locked : true,
    });
  }

  for (const v of variables) {
    const info = AllVariables[v.type];

    const inputs = info.getInputs(v);
    for (const [targetPort, inputList] of Object.entries(inputs)) {
      if (inputList) {
        inputList.forEach((input) => {
          edges.push(
            makeEdge({
              targetName: nodeNameToId[v.name]!,
              targetInput: targetPort,
              sourceName: nodeNameToId[input]!,
              targetHandle: `${nodeNameToId[v.name]}${PORT_NAME_SEPARATOR}${targetPort}`,
              sourceHandle: `${nodeNameToId[input]}${PORT_NAME_SEPARATOR}${OUTPUT_PORT_NAME}`,
            })
          );
        });
      }
    }
  }
  return {
    nodes,
    edges,
    nodeNameToId,
  };
}

export function makeEdge({
  targetName,
  targetInput,
  sourceName,
  targetHandle,
  sourceHandle,
}: {
  targetName: string;
  targetInput: string;
  sourceName: string;
  targetHandle: string;
  sourceHandle: string;
}): VariableEdgeType {
  return {
    id: `${targetName}${PORT_NAME_SEPARATOR}${targetInput}${PORT_NAME_SEPARATOR}${sourceName}`,
    source: sourceName,
    sourceHandle,
    target: targetName,
    targetHandle,
    data: {
      variableInput: targetInput,
    },
    type: "weatherman",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 12,
      height: 12,
      color: "#9B9A93",
      strokeWidth: 0,
    },
    style: {
      strokeWidth: 2,
      stroke: "#9B9A93",
    },
  };
}
