import { type Connection } from "@xyflow/react";

import {
  type VariableEdgeType,
  type VariableNodeType,
} from "../useNodesAndEdges";

export function portIsAlreadyFull({
  connection,
  nodes,
  edges,
}: {
  connection: Connection;
  nodes: VariableNodeType[];
  edges: VariableEdgeType[];
}) {
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!targetNode) {
    return true;
  }

  return edges.some(
    (edge) =>
      edge.target === connection.target &&
      edge.targetHandle === connection.targetHandle
  );
}
