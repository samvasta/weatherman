import React from "react";

import ReactFlow, {
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type OnConnect,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";

import { type AnyVariableData, setInput } from "@/types/variables";

import { ConnectionLine } from "./ConnectionLine";
import { VariableEdge } from "./VariableEdge";
import { VariableNode } from "./VariableNode";
import useLayoutNodes from "./useLayoutNodes";
import {
  OUTPUT_PORT_NAME,
  type VariableEdgeData,
  type VariableEdgeType,
  type VariableNodeType,
  makeEdge,
} from "./useNodesAndEdges";
import { wouldCreateCycle } from "./validation/cycle";

const nodeTypes = {
  var: VariableNode,
};

const edgeTypes = {
  weatherman: VariableEdge,
};

export type CanvasProps = {
  initialNodes: VariableNodeType[];
  initialEdges: VariableEdgeType[];
  // variables: AnyVariableData[];
  onVariablesChanged: (nextVariables: AnyVariableData[]) => void;
};

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
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

  const { getNodes, getEdges } = useReactFlow<
    AnyVariableData,
    VariableEdgeData
  >();

  const updateNodeInternals = useUpdateNodeInternals();

  const isValidConnection = React.useCallback(
    (connection: Connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes() as VariableNodeType[];
      const edges = getEdges() as VariableEdgeType[];
      if (
        connection.targetHandle &&
        connection.targetHandle.includes(OUTPUT_PORT_NAME)
      ) {
        return false;
      }
      if (wouldCreateCycle({ connection, nodes: nodes, edges })) {
        return false;
      }
      // if (portIsAlreadyFull({ connection, nodes: nodes, edges })) {
      //   return false;
      // }
      return true;
    },
    [getNodes, getEdges]
  );

  const onConnect: OnConnect = React.useCallback((params) => {
    if (
      params.source &&
      params.target &&
      params.sourceHandle &&
      params.targetHandle
    ) {
      const newEdge = makeEdge({
        sourceName: params.source,
        targetName: params.target,
        targetHandle: params.targetHandle,
        sourceHandle: params.sourceHandle,
        targetInput: params.targetHandle?.split("-")?.[1] ?? "",
      });

      const currentEdges = [...getEdges()];

      const existingEdgeForTargetPortIdx = currentEdges.findIndex(
        (e) =>
          e.target === params.target && e.targetHandle === params.targetHandle
      );

      let deletedEdges: Edge[] = [];
      if (existingEdgeForTargetPortIdx >= 0) {
        deletedEdges = currentEdges.splice(existingEdgeForTargetPortIdx, 1);
      }

      const nextEdges = addEdge(newEdge, currentEdges);

      onVariablesChanged(
        graphToVariables(getNodes() as VariableNodeType[], nextEdges)
      );
      setEdges(nextEdges);

      updateNodeInternals(params.target);
      for (const deletedEdge of deletedEdges) {
        updateNodeInternals(deletedEdge.source);
      }
    }
  }, []);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        onNodesChange(changes);
        // setNodes(
        //   (prev) => applyNodeChanges(changes, prev) as VariableNodeType[]
        // );
        if (changes.some((c) => c.type === "add" || c.type === "remove")) {
          onVariablesChanged(
            graphToVariables(getNodes() as VariableNodeType[], getEdges())
          );
        }
      }}
      onEdgesChange={(changes) => {
        onEdgesChange(changes);
        // setEdges(
        //   (prev) => applyEdgeChanges(changes, prev) as VariableEdgeType[]
        // );
        if (changes.some((c) => c.type === "add" || c.type === "remove")) {
          onVariablesChanged(
            graphToVariables(getNodes() as VariableNodeType[], getEdges())
          );
        }
      }}
      connectionLineComponent={ConnectionLine}
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

function graphToVariables(
  nodes: VariableNodeType[],
  edges: VariableEdgeType[]
): AnyVariableData[] {
  const vars: Record<string, AnyVariableData> = {};

  // console.log(nodes, edges);
  for (const node of nodes) {
    vars[node.id] = node.data;
  }

  for (const edge of edges) {
    // if (
    //   vars[edge.target]?.type === VariableType.Product ||
    //   vars[edge.target]?.type === VariableType.Sum
    // ) {
    //   console.log(
    //     "adding ",
    //     edge.source +
    //       " to input for " +
    //       edge.target +
    //       " at index " +
    //       edge.data!.variableInput
    //   );
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    //   (vars[edge.target] as unknown as any).inputs.push(edge.source);
    // } else {
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    //   (vars[edge.target] as unknown as any)[edge.data!.variableInput] =
    //     edge.source;
    // }

    setInput(
      vars[edge.target] as AnyVariableData,
      edge.data!.variableInput,
      edge.source
    );
  }

  return Object.values(vars);
}
