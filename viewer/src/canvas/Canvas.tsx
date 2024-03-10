import React from "react";

import ReactFlow, {
  Background,
  type Connection,
  Controls,
  MiniMap,
  type Node,
  type OnConnect,
  ReactFlowProvider,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { type AnyVariableData } from "@/types/variables";

import { VariableNode } from "./VariableNode";
import useLayoutNodes from "./useLayoutNodes";
import { type VariableEdge, type VariableNodeData } from "./useNodesAndEdges";

const nodeTypes = {
  var: VariableNode,
};

export type CanvasProps = {
  initialNodes: VariableNodeData[];
  initialEdges: VariableEdge[];
  onVariablesChanged: (nextVariables: AnyVariableData[]) => void;
};

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />{" "}
    </ReactFlowProvider>
  );
}

function CanvasInner({
  initialNodes,
  initialEdges,
  onVariablesChanged,
}: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useLayoutNodes();

  const { getNodes, getEdges } = useReactFlow();

  const isValidConnection = React.useCallback(
    (connection: Connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      if (!target) {
        return false;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) {
          return false;
        }

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) {
        return false;
      }
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const onConnect: OnConnect = React.useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      className="relative"
      attributionPosition="bottom-right"
      panOnDrag
      zoomOnScroll
      fitView
    >
      <Background />
      <Controls />
      <MiniMap className="absolute bottom-4 right-4" />
    </ReactFlow>
  );
}
