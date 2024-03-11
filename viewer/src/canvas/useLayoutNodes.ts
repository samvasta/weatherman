import { useEffect, useMemo } from "react";
import React from "react";

import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { useNodesInitialized, useReactFlow } from "reactflow";

import {
  type AnyVariableData,
  getInputPortNames,
  isCollector,
} from "@/types/variables";

import {
  OUTPUT_PORT_NAME,
  type VariableEdgeType,
  type VariableNodeType,
  variablesToNodesAndEdges,
} from "./useNodesAndEdges";

// elk layouting options can be found here:
// https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": "80",
  "elk.spacing.nodeNode": "20",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
  "org.eclipse.elk.mrtree.edgeRoutingMode": "AVOID_OVERLAP",
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
      const targetPortNames = getInputPortNames(n.data);

      const targetPorts = targetPortNames.map((portName, i) => ({
        id: `${n.data.name}-${portName}`,
        properties: {
          side: "WEST",
          index: -i,
        },
      }));

      let sourcePorts = [
        {
          id: `${n.data.name}-${OUTPUT_PORT_NAME}`,
          properties: {
            side: "EAST",
            index: 0,
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
          "org.eclipse.elk.layered.portSortingStrategy": "INPUT_ORDER",
          "org.eclipse.elk.layered.considerModelOrder.portModelOrder": "true",
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
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return { layoutedNodes, layoutedEdges: edges };
};

export default function useLayoutNodes() {
  const nodesInitialized = useNodesInitialized();
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

  useEffect(() => {
    if (nodesInitialized) {
      void updateNodes();
    }
  }, [nodesInitialized, updateNodes]);

  return updateNodes;
}

export function useReactFlowNodes({
  variables,
}: {
  variables: AnyVariableData[];
}): [
  {
    nodes: VariableNodeType[];
    edges: VariableEdgeType[];
  },
  React.Dispatch<
    React.SetStateAction<{
      nodes: VariableNodeType[];
      edges: VariableEdgeType[];
    }>
  >,
] {
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => {
    return variablesToNodesAndEdges(variables);
  }, [variables]);

  const [nodesAndEdges, setNodesAndEdges] = React.useState<{
    nodes: VariableNodeType[];
    edges: VariableEdgeType[];
  }>({ nodes: rawNodes, edges: rawEdges });

  const updateNodes = React.useCallback(async () => {
    const { layoutedNodes, layoutedEdges } = await getLayoutedNodes(
      rawNodes,
      rawEdges
    );

    setNodesAndEdges({ nodes: layoutedNodes, edges: layoutedEdges });
  }, [rawNodes, rawEdges]);

  useEffect(() => {
    void updateNodes();
  }, [updateNodes]);

  return [nodesAndEdges, setNodesAndEdges];
}
