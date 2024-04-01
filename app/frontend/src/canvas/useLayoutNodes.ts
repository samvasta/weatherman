import React from "react";

import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { useReactFlow } from "reactflow";

import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";

import {
  OUTPUT_PORT_NAME,
  PORT_NAME_SEPARATOR,
  type VariableEdgeType,
  type VariableNodeType,
} from "./useNodesAndEdges";

// elk layouting options can be found here:
// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": "80",
  "elk.spacing.nodeNode": "20",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.edgeRouting": "ORTHOGONAL",
};

const elk = new ELK();

// uses elkjs to give each node a layouted position
export const getLayoutedNodes = async (
  nodes: VariableNodeType[],
  edges: VariableEdgeType[]
) => {
  const graph: ElkNode = {
    id: "root",
    layoutOptions,
    children: nodes.map((n) => {
      const info = AllVariables[n.data.type];
      const targetPortNames = info.getPorts(n.data.type);

      const targetPorts = targetPortNames.map((port, i) => ({
        id: `${n.id}${PORT_NAME_SEPARATOR}${port.name}`,
        properties: {
          side: "WEST",
          index: -i,
        },
      }));

      let sourcePorts = [
        {
          id: `${n.id}${PORT_NAME_SEPARATOR}${OUTPUT_PORT_NAME}`,
          properties: {
            side: "EAST",
            index: 0,
          },
        },
      ];
      if (!info.hasOutput) {
        sourcePorts = [];
      }

      return {
        id: n.id,
        width: n.width ?? 150,
        height: n.height ?? 50,
        // ⚠️ we need to tell elk that the ports are fixed, in order to reduce edge crossings
        properties: {
          "elk.portConstraints": "FIXED_ORDER",
          "elk.layered.portSortingStrategy": "INPUT_ORDER",
          "elk.layered.considerModelOrder.portModelOrder": "true",
        },
        // we are also passing the id, so we can also handle edges without a sourceHandle or targetHandle option
        ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
      } as ElkNode;
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
      properties: {
        "org.eclipse.elk.edge.type": "DIRECTED",
      },
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );

    return {
      ...node,
      data: {
        ...node.data,
        ui: {
          x: layoutedNode?.x ?? 0,
          y: layoutedNode?.y ?? 0,
          id: node.id,
          isOutputFloating: node.data.ui.isOutputFloating ?? false,
        },
      },
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    } as VariableNodeType;
  });

  return { layoutedNodes, layoutedEdges: edges };
};

export default function useLayoutNodes() {
  const { getNodes, getEdges, setNodes, setEdges, fitView } =
    useReactFlow<AnyVariableData>();

  const updateNodes = React.useCallback(async () => {
    const { layoutedNodes, layoutedEdges } = await getLayoutedNodes(
      getNodes() as VariableNodeType[],
      getEdges() as VariableEdgeType[]
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setTimeout(() => fitView(), 0);
  }, [getNodes, getEdges, setNodes, setEdges, fitView]);

  return updateNodes;
}
