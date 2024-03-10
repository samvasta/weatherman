import { type Edge, MarkerType, type Node } from "reactflow";

import { type AnyVariableData, getVariableInputs } from "@/types/variables";

export type VariableNodeData = Node<AnyVariableData, "var">;
export type VariableEdge = Edge<{
  targetPort: string;
}>;

export const OUTPUT_PORT_NAME = "output";

export function useNodesAndEdges(variables: AnyVariableData[]): {
  nodes: VariableNodeData[];
  edges: VariableEdge[];
} {
  const nodes: VariableNodeData[] = [];

  const edges: VariableEdge[] = [];

  for (const v of variables) {
    nodes.push({
      id: v.name,
      data: v,
      position: { x: 0, y: 0 },
      width: 300,
      height: 300,
      type: "var",
      draggable: false,
    });

    const inputs = getVariableInputs(v);
    for (const [targetPort, input] of Object.entries(inputs)) {
      edges.push({
        id: `${v.name}-${targetPort}-${input}`,
        source: input,
        sourceHandle: `${input}-${OUTPUT_PORT_NAME}`,
        target: v.name,
        targetHandle: `${v.name}-${targetPort}`,
        data: {
          targetPort: `${v.name}-${targetPort}`,
        },
        type: "smoothstep",
        updatable: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "#58795D",
        },
        style: {
          strokeWidth: 2,
          stroke: "#58795D",
        },
      });
    }
  }

  return {
    nodes,
    edges,
  };
}
