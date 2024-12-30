import React, { type DragEventHandler, useEffect } from "react";

import {
  Background,
  type Connection,
  ConnectionLineComponent,
  Controls,
  type Edge,
  MiniMap,
  type OnConnect,
  ReactFlow,
  type ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  isEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAtomValue, useSetAtom } from "jotai";
import { SaveIcon, UserIcon } from "lucide-react";
import { nanoid } from "nanoid";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/primitives/alert/Alert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/primitives/resizable/Resizable";

import { isLoggedInAtom } from "@/state/auth.atoms";
import {
  getCompiledModelAtom,
  setCompiledModelAtom,
} from "@/state/model.atoms";
import { isSimulatedAtom } from "@/state/simulationResults.atoms";
import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";

import { ConnectionLine } from "./ConnectionLine";
import { Menu } from "./Menu";
import { VariableEdge } from "./VariableEdge";
import { VariableNode } from "./VariableNode";
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
      <div className="relative m-0 flex h-screen w-screen flex-col overflow-hidden bg-neutral-1 font-sans text-neutral-12 scheme-neutral">
        <Menu />

        <ResizablePanelGroup
          direction="horizontal"
          className="flex h-full min-h-[200px] w-full"
        >
          <ResizablePanel defaultSize={25}>
            <div className="h-full overflow-auto border-r-4 bg-neutral-3">
              <Toolbar />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="h-full w-full">
              <CanvasInner {...props} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <SaveBanner />
      </div>
    </ReactFlowProvider>
  );
}

function SaveBanner() {
  const compiledModel = useAtomValue(getCompiledModelAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  if (!isLoggedIn) {
    return (
      <Alert>
        <UserIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently not logged in. Make sure to log in to save your
          work!
        </AlertDescription>
      </Alert>
    );
  }
  if (!compiledModel.id) {
    return (
      <Alert>
        <SaveIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are currently working in an unsaved file. Make sure to save your
          work!
        </AlertDescription>
      </Alert>
    );
  }
  return null;
}

function CanvasInner({ initialNodes, initialEdges }: CanvasProps) {
  const setCompiledModel = useSetAtom(setCompiledModelAtom);
  const isSimulated = useAtomValue(isSimulatedAtom);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<
      VariableNodeType,
      VariableEdgeType
    > | null>(null);

  const { getNodes, getEdges } = useReactFlow<
    VariableNodeType,
    VariableEdgeType
  >();

  useEffect(() => {
    const nextModel = graphToModel(nodes, edges);
    setCompiledModel(nextModel);
  }, [nodes, edges, setCompiledModel]);

  const updateNodeInternals = useUpdateNodeInternals();

  const isValidConnection = React.useCallback(
    (connection: VariableEdgeType | Connection) => {
      if (isEdge(connection)) {
        //to appease typescript. Not sure why <EdgeType> is an option but that's what the library types say...
        return false;
      }
      if (isSimulated) {
        return false;
      }
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

        const port = info
          .getPorts(targetNode.data.type)
          .find((port) => port.name === portStr);

        if (port && port.connectionStrategy === "block") {
          return false;
        }
      }

      return true;
    },
    [getNodes, getEdges, isSimulated]
  );

  const onConnect: OnConnect = React.useCallback(
    (params) => {
      if (isSimulated) {
        return;
      }
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
    },
    [isSimulated]
  );

  const onDragOver = React.useCallback<DragEventHandler>(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [isSimulated]
  );

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
      while (existingNodes.some((n) => n.data.name === name)) {
        name = `${data.name} ${i++}`;
      }

      const id = nanoid(8);
      const newNode: VariableNodeType = {
        id,
        type: "var",
        position,
        data: {
          ...data,
          name,
          ui: {
            ...data.ui,
            ...position,
            id: id,
          },
        },
        zIndex: data.type === VariableType.Region ? data.layer : 20,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, isSimulated]
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        if (
          !isSimulated &&
          changes.some(
            (c) =>
              c.type === "add" ||
              c.type === "remove" ||
              c.type === "replace" ||
              c.type === "position"
          )
        ) {
          onNodesChange(changes);
        } else {
          onNodesChange(
            changes.filter(
              (c) => c.type === "dimensions" || c.type === "select"
            )
          );
        }
      }}
      onEdgesChange={(changes) => {
        if (
          !isSimulated &&
          changes.some(
            (c) =>
              c.type === "add" || c.type === "remove" || c.type === "replace"
          )
        ) {
          onEdgesChange(changes);
        } else {
          onEdgesChange(changes.filter((c) => c.type === "select"));
        }
      }}
      defaultEdgeOptions={{
        zIndex: 15,
      }}
      connectionLineComponent={ConnectionLine as ConnectionLineComponent}
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
      minZoom={0.01}
      zoomOnDoubleClick={false}
      snapGrid={[1, 1]}
      snapToGrid
    >
      <Background color="#868e8b" />
      <Controls />
      <MiniMap className="absolute bottom-4 right-4" />
    </ReactFlow>
  );
}
