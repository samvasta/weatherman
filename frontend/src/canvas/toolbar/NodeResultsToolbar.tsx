import React from "react";

import { useNodes } from "@xyflow/react";

import { Button } from "@/components/primitives/button/Button";
import { Dialog } from "@/components/primitives/floating/dialog/Dialog";

import { EmptyState } from "@/components/empty/EmptyState";

import { RiverChart } from "@/charts/river/RiverChart";
import { useSimulationResultForNode } from "@/state/simulationResults.atoms";

import { type VariableNodeType } from "../useNodesAndEdges";

export function NodeResultsToolbar({
  selected,
}: {
  selected: VariableNodeType;
}) {
  const nodes = useNodes<VariableNodeType>();

  const node = React.useMemo(
    () => nodes.find((n) => n.id === selected.id),
    [nodes, selected.id]
  );

  const results = useSimulationResultForNode(selected.data.name);

  const [type, setType] = React.useState<"hair" | "river">("river");

  if (!node) {
    return <EmptyState heading="Invalid Node" />;
  }

  if (!results) {
    return <EmptyState heading="This node does not collect results." />;
  }

  return (
    <div className="flex max-h-[50vh] w-fit gap-2 overflow-y-auto p-4">
      <Dialog
        contentProps={{
          className:
            "min-h-[80vh] h-[400px] w-[80vw] max-w-[80vw] max-h-[80vh] p-0",
        }}
        content={({ onClose }) => (
          <>
            <Button
              className="absolute left-4 top-4 w-fit"
              onClick={() =>
                setType((prev) => (prev === "river" ? "hair" : "river"))
              }
            >
              toggle type
            </Button>
            <RiverChart
              name={node.data.name}
              data={{
                baseColor: "",
                percentiles: results.steps,
                series: results.iterationSeries,
              }}
              type={type}
            />
          </>
        )}
      >
        <Button variant="solid" colorScheme="primary" className="w-fit">
          River Chart
        </Button>
      </Dialog>
    </div>
  );
}
