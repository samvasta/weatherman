import React from "react";

import { Handle, type NodeProps, Position, useEdges } from "reactflow";

import { Txt } from "@/components/primitives/text/Text";

import {
  type AnyVariableData,
  getInputPortNames,
  isCollector,
  isDivide,
  isIVar,
  isInvert,
  isPower,
  isProduct,
  isSum,
} from "@/types/variables";
import { cn } from "@/utils/tailwind";

import { CollectorNode } from "./nodes/CollectorNode";
import { DivideNode } from "./nodes/DivideNode";
import { IVarNode } from "./nodes/IVarNode";
import { InvertNode } from "./nodes/InvertNode";
import { PowerNode } from "./nodes/PowerNode";
import { ProductNode } from "./nodes/ProductNode";
import { SumNode } from "./nodes/SumNode";
import { OUTPUT_PORT_NAME } from "./useNodesAndEdges";

function useNodeContent(variable: AnyVariableData) {
  if (isCollector(variable)) {
    return <CollectorNode data={variable} />;
  }
  if (isDivide(variable)) {
    return <DivideNode data={variable} />;
  }
  if (isInvert(variable)) {
    return <InvertNode data={variable} />;
  }
  if (isPower(variable)) {
    return <PowerNode data={variable} />;
  }
  if (isProduct(variable)) {
    return <ProductNode data={variable} />;
  }
  if (isSum(variable)) {
    return <SumNode data={variable} />;
  }
  if (isIVar(variable)) {
    return <IVarNode data={variable} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  throw new Error("Unknown variable type, " + (variable as any).type);
}

export const VariableNode = React.memo(
  ({ id, data, selected }: NodeProps<AnyVariableData>) => {
    const edges = useEdges();
    const targetPorts = getInputPortNames(data);

    const hasOutput = !isCollector(data);

    const Content = useNodeContent(data);

    return (
      <div
        className={cn(
          "grid min-w-20 rounded-sm border bg-neutral-1 text-neutral-13 shadow-md",
          selected &&
            "border-primary-9 bg-primary-2 text-primary-12 scheme-primary"
        )}
        style={{
          minHeight: (targetPorts.length + 1) * 16 + 32,
        }}
      >
        <div className="targets absolute top-0 flex h-full w-2 flex-col justify-between py-2">
          {targetPorts.map((handle) => {
            const edge = edges.find(
              (e) => e.target === id && e.targetHandle === `${id}-${handle}`
            );
            return (
              <Handle
                key={handle}
                id={`${data.name}-${handle}`}
                type="target"
                position={Position.Left}
                className="!relative !-left-0.5 !top-0 !h-3 !w-2 !-translate-x-[100%] !translate-y-0 !rounded-r-none !border-0 !border-cur-scheme-12 !bg-cur-scheme-12"
              >
                {selected && edge ? (
                  <Txt className="pointer-events-none absolute bottom-3 right-1 w-fit bg-neutral-1">
                    {edge.source}
                    <Txt as="span" intent="subtle" className="scheme-neutral">
                      ({handle})
                    </Txt>
                  </Txt>
                ) : (
                  handle.length > 1 && (
                    <Txt className="pointer-events-none absolute bottom-3 right-1 w-fit bg-neutral-1">
                      {handle}
                    </Txt>
                  )
                )}
              </Handle>
            );
          })}
        </div>
        <div className="relative h-full w-full">{Content}</div>
        <div className="sources absolute right-0 top-0 flex h-full w-3 flex-col justify-around">
          {hasOutput && (
            <Handle
              key={OUTPUT_PORT_NAME}
              id={`${data.name}-${OUTPUT_PORT_NAME}`}
              type="source"
              position={Position.Right}
              className="!border-0-2 !relative !-right-1 !top-0 !h-3 !w-2 !translate-x-[100%] !translate-y-0 !rounded-l-none !border-0 !border-cur-scheme-12 !bg-cur-scheme-12"
            />
          )}
        </div>
      </div>
    );
  }
);
VariableNode.displayName = "VariableNode";
