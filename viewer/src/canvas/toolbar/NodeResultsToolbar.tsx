import React from "react";

import { useNodes } from "reactflow";

import { EmptyState } from "@/components/empty/EmptyState";

import { AllVariables } from "@/types/variables/allVariables";

import { useSimulationResultForNode } from "../atoms";
import { type VariableNodeType } from "../useNodesAndEdges";

export function NodeResultsToolbar({
  selected,
}: {
  selected: VariableNodeType;
}) {
  const info = AllVariables[selected.data.type];

  const nodes = useNodes();

  const node = React.useMemo(
    () => nodes.find((n) => n.id === selected.id),
    [nodes, selected.id]
  );

  const results = useSimulationResultForNode(selected.data.name);

  if (!node) {
    return <EmptyState heading="Invalid Node" />;
  }

  if (!results) {
    return <EmptyState heading="This node does not collect results." />;
  }

  return (
    <div className="flex max-h-[50vh] w-fit gap-2 overflow-y-auto p-4">
      {JSON.stringify(results.steps)}
    </div>
  );
}
