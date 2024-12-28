import React from "react";

import { EmptyState } from "@/components/empty/EmptyState";

import { AllVariables } from "@/types/variables/allVariables";

import { type VariableNodeType } from "../useNodesAndEdges";
import { useOnUpdateNode } from "../useOnUpdateNode";

export function NodePropertiesToolbar({
  selected,
}: {
  selected: VariableNodeType;
}) {
  const info = AllVariables[selected.data.type];

  const { onUpdateNode, node } = useOnUpdateNode(selected.data);

  if (!node) {
    return <EmptyState heading="Invalid Node" />;
  }

  return (
    <div className="flex w-fit max-w-[50vw] flex-col gap-2 overflow-y-auto p-4">
      <info.VariableProperties data={node.data} onChange={onUpdateNode} />
    </div>
  );
}
