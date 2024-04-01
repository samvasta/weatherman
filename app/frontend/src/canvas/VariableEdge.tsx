import React, { useEffect } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
  useNodes,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";

import { IconButton } from "@/components/primitives/button/Button";

import { type AnyVariableData } from "@/types/variables/allVariables";

import { isSimulatedAtom, setCompiledModelAtom } from "./atoms";
import { graphToModel } from "./graphToModel";
import { type VariableNodeType } from "./useNodesAndEdges";
import { Txt } from "@/components/primitives/text/Text";

export function VariableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  selected,
  markerEnd,
  source,
  target,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const updateNodeInternals = useUpdateNodeInternals();
  const nodes = useNodes<AnyVariableData>();
  const { setEdges } = useReactFlow();
  const setCompiledModel = useSetAtom(setCompiledModelAtom);
  const isSimulated = useAtomValue(isSimulatedAtom);

  const connectedNodes = nodes.filter(
    (n) => n.id === source || n.id === target
  );
  const isNodeSelected = connectedNodes.some((n) => n.selected);

  const sourceNode = connectedNodes.find((n) => n.id === source);

  const anyNodeSelected = nodes.some((n) => n.selected);

  const onEdgeClick = () => {
    setEdges((edges) => {
      const nextEdges = edges.filter((edge) => edge.id !== id);

      const nextModel = graphToModel(nodes as VariableNodeType[], nextEdges);

      setCompiledModel(nextModel);

      return nextEdges;
    });

    updateNodeInternals(source);
  };

  if (sourceNode?.data.ui.isOutputFloating) {
    return (
      <>
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-100%, -50%) translate(${targetX - 80}px,${targetY}px)`,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: "all",
            }}
            className="nodrag nopan bg-magic-3 text-magic-12 grid place-items-center w-fit px-1 h-6 leading-none rounded-none border-0 text-lg font-medium border-magic-9 border-r-4 max-w-[500px]"
          >
            <Txt className="truncate max-w-full">{sourceNode.data.name}</Txt>
          </div>
        </EdgeLabelRenderer>
        <path
          d={`M ${targetX - 80} ${targetY} h 100`}
          className="stroke-magic-9"
          strokeWidth={4}
          strokeDasharray={"8 6"}
        />
      </>
    );
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd || ""}
        style={{
          ...style,
          stroke:
            selected || isNodeSelected
              ? "#218358"
              : anyNodeSelected
                ? // add opacity to emphasize the selected edges and to make the selected edges show through
                  "#9B9A9344"
                : "#9B9A93",
        }}
      />
      {!isSimulated && (isNodeSelected || selected) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <IconButton
              onClick={onEdgeClick}
              size="xs"
              variant="ghost"
              className="h-fit w-fit rounded-full border border-neutral-9 bg-neutral-1 p-0.5 text-neutral-12 scheme-neutral hover:border-danger-10 hover:bg-danger-3 hover:text-danger-12 hover:scheme-danger"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
