import React from "react";

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

import { compiledModelAtom, isSimulatedAtom } from "./atoms";
import { graphToModel } from "./graphToModel";
import { type VariableNodeType } from "./useNodesAndEdges";

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
  const setCompiledModel = useSetAtom(compiledModelAtom);
  const isSimulated = useAtomValue(isSimulatedAtom);

  const isNodeSelected = nodes.some(
    (n) => n.selected && (n.id === source || n.id === target)
  );
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
