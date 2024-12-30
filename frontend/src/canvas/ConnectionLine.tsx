import React from "react";

import {
  ConnectionLineComponent,
  type ConnectionLineComponentProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { useAtomValue } from "jotai";

import { isSimulatedAtom } from "@/state/simulationResults.atoms";
import { cn } from "@/utils/tailwind";

import { type VariableNodeType } from "./useNodesAndEdges";

export const ConnectionLine: ConnectionLineComponent<VariableNodeType> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
  fromNode,
}: ConnectionLineComponentProps<VariableNodeType>) => {
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
          (fromNode as VariableNodeType).data.ui.isOutputFloating &&
            "stroke-magic-9",
          isSimulated && "stroke-neutral-6",
          connectionStatus === "invalid" && "stroke-danger-10"
        )}
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fbfdfc"
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
};
