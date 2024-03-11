import React from "react";

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
  const nodes = useNodes();
  const { setEdges } = useReactFlow();

  const isNodeSelected = nodes.some(
    (n) => n.selected && (n.id === source || n.id === target)
  );

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));

    updateNodeInternals(source);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected || isNodeSelected ? "#218358" : "#9B9A93",
        }}
      />
      {(isNodeSelected || selected) && (
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
              className="h-fit w-fit rounded-full border border-cur-scheme-9 bg-cur-scheme-2 p-0.5 text-cur-scheme-9 scheme-danger"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
