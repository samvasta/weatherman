import React from "react";

import { Handle, type NodeProps, Position } from "reactflow";

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
  ({ data }: NodeProps<AnyVariableData>) => {
    const targetPorts = getInputPortNames(data);

    const hasOutput = !isCollector(data);

    const Content = useNodeContent(data);

    return (
      <div className="min-h-20 min-w-20 rounded-lg border bg-neutral-1 text-neutral-13">
        <div className="targets absolute top-0 flex h-full w-3 flex-col justify-around">
          {targetPorts.map((handle) => (
            <Handle
              key={handle}
              id={`${data.name}-${handle}`}
              type="target"
              position={Position.Left}
            />
          ))}
        </div>
        <div className="flex h-full w-full flex-col gap-1 p-6">{Content}</div>
        <div className="sources absolute right-0 top-0 flex h-full w-3 flex-col justify-around">
          {hasOutput && (
            <Handle
              key={OUTPUT_PORT_NAME}
              id={`${data.name}-${OUTPUT_PORT_NAME}`}
              type="source"
              position={Position.Right}
              className="h-16 w-16 bg-success-12"
            />
          )}
        </div>
      </div>
    );
  }
);
VariableNode.displayName = "VariableNode";
