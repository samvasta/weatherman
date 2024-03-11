import { type Edge, MarkerType, type Node } from "reactflow";

import { type AnyVariableData, getVariableInputs } from "@/types/variables";

export type VariableNodeType = Node<AnyVariableData, "var">;

export type VariableEdgeData = {
  variableInput: string;
};
export type VariableEdgeType = Edge<VariableEdgeData>;

export const OUTPUT_PORT_NAME = "output";

export function useNodesAndEdges(variables: AnyVariableData[]): {
  nodes: VariableNodeType[];
  edges: VariableEdgeType[];
} {
  const nodes: VariableNodeType[] = [];

  const edges: VariableEdgeType[] = [];

  for (const v of variables) {
    nodes.push({
      id: v.name,
      data: v,
      position: { x: 0, y: 0 },
      width: 300,
      height: 300,
      type: "var",
      // draggable: false,
    });

    const inputs = getVariableInputs(v);
    for (const [targetPort, input] of Object.entries(inputs)) {
      edges.push(
        makeEdge({
          targetName: v.name,
          targetInput: targetPort,
          sourceName: input,
          targetHandle: `${v.name}-${targetPort}`,
          sourceHandle: `${input}-${OUTPUT_PORT_NAME}`,
        })
      );
    }
  }

  return {
    nodes,
    edges,
  };
}

export function variablesToNodesAndEdges(variables: AnyVariableData[]): {
  nodes: VariableNodeType[];
  edges: VariableEdgeType[];
} {
  const nodes: VariableNodeType[] = [];

  const edges: VariableEdgeType[] = [];

  for (const v of variables) {
    nodes.push({
      id: v.name,
      data: v,
      position: { x: 0, y: 0 },
      width: 300,
      height: 300,
      type: "var",
      // draggable: false,
    });

    const inputs = getVariableInputs(v);
    for (const [targetPort, input] of Object.entries(inputs)) {
      if (input) {
        edges.push(
          makeEdge({
            targetName: v.name,
            targetInput: targetPort,
            sourceName: input,
            targetHandle: `${v.name}-${targetPort}`,
            sourceHandle: `${input}-${OUTPUT_PORT_NAME}`,
          })
        );
      }
    }
  }

  return {
    nodes,
    edges,
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
    id: `${targetName}-${targetInput}-${sourceName}`,
    source: sourceName,
    sourceHandle,
    target: targetName,
    targetHandle,
    data: {
      variableInput: targetInput,
    },
    type: "weatherman",
    updatable: true,
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
