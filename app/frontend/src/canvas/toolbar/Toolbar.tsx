import React from "react";

import { useAtomValue } from "jotai";
import { useOnSelectionChange } from "reactflow";

import { isSimulatedAtom } from "../atoms";
import {
  type VariableEdgeType,
  type VariableNodeType,
} from "../useNodesAndEdges";
import { NodePaletteToolbar } from "./NodePaletteToolbar";
import { NodePropertiesToolbar } from "./NodePropertiesToolbar";
import { NodeResultsToolbar } from "./NodeResultsToolbar";

export function Toolbar() {
  const [selectedNode, setSelectedNode] =
    React.useState<VariableNodeType | null>(null);
  const [selectedEdge, setSelectedEdge] =
    React.useState<VariableEdgeType | null>(null);

  const isSimulated = useAtomValue(isSimulatedAtom);

  useOnSelectionChange({
    onChange: (params) => {
      if (params.edges.length > 0) {
        setSelectedEdge(params.edges[0] as VariableEdgeType);
        setSelectedNode(null);
      } else if (params.nodes.length > 0) {
        setSelectedEdge(null);
        setSelectedNode(params.nodes[0] as VariableNodeType);
      } else {
        setSelectedEdge(null);
        setSelectedNode(null);
      }
    },
  });

  if (isSimulated) {
    if (selectedNode) {
      return <NodeResultsToolbar selected={selectedNode} />;
    }
    return <></>;
  }

  if (selectedNode) {
    return <NodePropertiesToolbar selected={selectedNode} />;
  }

  return <NodePaletteToolbar />;
}
