import React from "react";

import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
  useNodes,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";

import { IconButton } from "@/components/primitives/button/Button";
import { Txt } from "@/components/primitives/text/Text";

import { type AnyVariableData } from "@/types/variables/allVariables";

import { isSimulatedAtom, setCompiledModelAtom } from "./atoms";
import { graphToModel } from "./graphToModel";
import {
  VariableEdgeData,
  VariableEdgeType,
  type VariableNodeType,
} from "./useNodesAndEdges";

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
  const nodes = useNodes<VariableNodeType>();
  const { setEdges } = useReactFlow<VariableNodeType, VariableEdgeType>();
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
            className="nodrag nopan z-edgeLabel grid h-6 w-fit max-w-[500px] place-items-center rounded-none border-0 border-r-4 border-magic-9 bg-magic-3 px-1 text-lg font-medium leading-none text-magic-12"
          >
            <Txt className="max-w-full truncate">{sourceNode.data.name}</Txt>
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
            className="nodrag nopan z-edgeLabel"
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
