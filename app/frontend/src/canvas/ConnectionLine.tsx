import React from "react";

import { useAtomValue } from "jotai";
import {
  type ConnectionLineComponentProps,
  getSmoothStepPath,
} from "reactflow";

import { cn } from "@/utils/tailwind";

import { isSimulatedAtom } from "./atoms";

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

  const isSimulated = useAtomValue(isSimulatedAtom);

  return (
    <g>
      <path
        fill="none"
        strokeWidth={6}
        className={cn(
          "animated stroke-primary-11",
          isSimulated && "stroke-neutral-6",
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
          isSimulated && "stroke-neutral-6",
          connectionStatus === "invalid" && "stroke-danger-10"
        )}
      />
    </g>
  );
}
