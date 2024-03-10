import { useEffect } from "react";

import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { useNodesInitialized, useReactFlow } from "reactflow";

import {
  type AnyVariableData,
  getInputPortNames,
  isCollector,
} from "@/types/variables";

import {
  OUTPUT_PORT_NAME,
  type VariableEdge,
  type VariableNodeData,
} from "./useNodesAndEdges";

// elk layouting options can be found here:
// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": "80",
  "elk.spacing.nodeNode": "20",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
};

const elk = new ELK();

// uses elkjs to give each node a layouted position
export const getLayoutedNodes = async (
  nodes: VariableNodeData[],
  edges: VariableEdge[]
) => {
  const graph: ElkNode = {
    id: "root",
    layoutOptions,
    children: nodes.map((n) => {
      const targetPortNames = getInputPortNames(n.data);

      const targetPorts = targetPortNames.map((portName) => ({
        id: `${n.data.name}-${portName}`,
        properties: {
          side: "WEST",
        },
      }));

      let sourcePorts = [
        {
          id: `${n.data.name}-${OUTPUT_PORT_NAME}`,
          properties: {
            side: "EAST",
          },
        },
      ];
      if (isCollector(n.data)) {
        sourcePorts = [];
      }

      return {
        id: n.id,
        width: n.width ?? 150,
        height: n.height ?? 50,
        // ⚠️ we need to tell elk that the ports are fixed, in order to reduce edge crossings
        properties: {
          "org.eclipse.elk.portConstraints": "FIXED_ORDER",
        },
        // we are also passing the id, so we can also handle edges without a sourceHandle or targetHandle option
        ports: [{ id: n.id }, ...targetPorts, ...sourcePorts],
      } as ElkNode;
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );

    console.log(
      layoutedNode?.layoutOptions,
      layoutedNode?.x,
      layoutedNode?.y,
      layoutedNode?.edges
    );

    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return layoutedNodes;
};

export default function useLayoutNodes() {
  const nodesInitialized = useNodesInitialized();
  const { getNodes, getEdges, setNodes, fitView } =
    useReactFlow<AnyVariableData>();

  useEffect(() => {
    if (nodesInitialized) {
      const layoutNodes = async () => {
        const layoutedNodes = await getLayoutedNodes(
          getNodes() as VariableNodeData[],
          getEdges() as VariableEdge[]
        );

        setNodes(layoutedNodes);
        setTimeout(() => fitView(), 0);
      };

      layoutNodes();
    }
  }, [nodesInitialized, getNodes, getEdges, setNodes, fitView]);

  return null;
}
