import React, { type DragEventHandler, useEffect } from "react";

import { useSetAtom } from "jotai";
import ReactFlow, {
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type OnConnect,
  type ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";

import { ConnectionLine } from "./ConnectionLine";
import { Menu } from "./Menu";
import { VariableEdge } from "./VariableEdge";
import { VariableNode } from "./VariableNode";
import { compiledModelAtom } from "./atoms";
import { graphToModel } from "./graphToModel";
import { Toolbar } from "./toolbar/Toolbar";
import {
  OUTPUT_PORT_NAME,
  PORT_NAME_SEPARATOR,
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
};

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <div className="min-h-0 grow">
          <CanvasInner {...props} />
        </div>
        <div className="h-fit min-h-0 grow-0 border-t-4 bg-neutral-3">
          <Toolbar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

function CanvasInner({ initialNodes, initialEdges }: CanvasProps) {
  const setCompiledModel = useSetAtom(compiledModelAtom);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<AnyVariableData, VariableEdgeData> | null>(
      null
    );

  const { getNodes, getEdges } = useReactFlow<
    AnyVariableData,
    VariableEdgeData
  >();

  useEffect(() => {
    const nextModel = graphToModel(
      getNodes() as VariableNodeType[],
      getEdges()
    );
    setCompiledModel(nextModel);
  }, [getNodes, getEdges, setCompiledModel]);

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

      const targetNode = nodes.find((n) => n.id === connection.target);
      if (connection.targetHandle && targetNode) {
        const info = AllVariables[targetNode.data.type];
        const portStr = connection.targetHandle.split("-")[1];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const port = info
          .getPorts(targetNode.data.type)
          .find((port) => port.name === portStr);

        if (port && port.connectionStrategy === "block") {
          return false;
        }
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
      const nodes = getNodes() as VariableNodeType[];

      const targetNode = nodes.find((n) => n.id === params.target);

      if (!targetNode) {
        console.error(`Node not found with id=${params.target}`);
        return;
      }
      const info = AllVariables[targetNode.data.type];

      const portStr = params.targetHandle.split(PORT_NAME_SEPARATOR)[1];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const port = info
        .getPorts(targetNode.data.type)
        .find((port) => port.name === portStr);

      if (!port) {
        console.error(
          `Port called "${params.targetHandle}" (searching for ${portStr}) not found on type ${targetNode.data.type}. (valid ports are [${info
            .getPorts(targetNode.data.type)
            .map((p) => p.name)
            .join(", ")}])`
        );
        return;
      }

      if (port.connectionStrategy === "block") {
        console.error(`Port called "${params.targetHandle}" is not writable`);
        return;
      }

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
      if (
        existingEdgeForTargetPortIdx >= 0 &&
        port.connectionStrategy === "overwrite"
      ) {
        deletedEdges = currentEdges.splice(existingEdgeForTargetPortIdx, 1);
      }

      const nextEdges = addEdge(newEdge, currentEdges);

      const nextModel = graphToModel(nodes, nextEdges);
      setCompiledModel(nextModel);
      setEdges(nextEdges);

      updateNodeInternals(params.target);
      for (const deletedEdge of deletedEdges) {
        updateNodeInternals(deletedEdge.source);
      }
    }
  }, []);

  const onDragOver = React.useCallback<DragEventHandler>((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback<DragEventHandler>(
    (event) => {
      event.preventDefault();

      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      ) as AnyVariableData;

      // check if the dropped element is valid
      if (
        typeof data === "undefined" ||
        !data ||
        !data.type ||
        !Object.values(VariableType).includes(data.type) ||
        !reactFlowInstance
      ) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const existingNodes = getNodes();
      let name = data.name;
      let i = 2;
      while (existingNodes.some((n) => n.id === name)) {
        name = `${data.name} ${i++}`;
      }

      const newNode: VariableNodeType = {
        id: name,
        type: "var",
        position,
        data: {
          ...data,
          name,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

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
          const nextModel = graphToModel(
            getNodes() as VariableNodeType[],
            getEdges()
          );

          setCompiledModel(nextModel);
        }
      }}
      onEdgesChange={(changes) => {
        onEdgesChange(changes);
        // setEdges(
        //   (prev) => applyEdgeChanges(changes, prev) as VariableEdgeType[]
        // );
        if (changes.some((c) => c.type === "add" || c.type === "remove")) {
          const nextModel = graphToModel(
            getNodes() as VariableNodeType[],
            getEdges()
          );
          setCompiledModel(nextModel);
        }
      }}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      onInit={setReactFlowInstance}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative"
      attributionPosition="bottom-right"
      panOnDrag
      zoomOnScroll
      fitView
      multiSelectionKeyCode={null}
    >
      <Background />
      <Controls />
      <MiniMap className="absolute bottom-4 right-4" />
      <Menu />
    </ReactFlow>
  );
}
