import React from "react";

import {
  type ConnectionLineComponentProps,
  getSmoothStepPath,
} from "reactflow";

import { cn } from "@/utils/tailwind";

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,

    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        strokeWidth={6}
        className={cn(
          "animated stroke-primary-11",
          connectionStatus === "invalid" && "stroke-danger-10"
        )}
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#FCFBF8"
        r={9}
        strokeWidth={6}
        className={cn(
          "stroke-primary-11",
          connectionStatus === "invalid" && "stroke-danger-10"
        )}
      />
    </g>
  );
}
