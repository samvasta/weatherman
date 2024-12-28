import { type Connection, type Node, getOutgoers } from "@xyflow/react";

import {
  type VariableEdgeType,
  type VariableNodeType,
} from "../useNodesAndEdges";

export function wouldCreateCycle({
  connection,
  nodes,
  edges,
}: {
  connection: Connection;
  nodes: VariableNodeType[];
  edges: VariableEdgeType[];
}) {
  if (connection.source === connection.target) {
    return true;
  }

  const target = nodes.find((node) => node.id === connection.target);
  if (!target) {
    return true;
  }

  const hasCycle = (node: Node, visited = new Set()) => {
    if (visited.has(node.id)) {
      return false;
    }

    visited.add(node.id);

    for (const outgoer of getOutgoers(node, nodes, edges)) {
      if (outgoer.id === connection.source || hasCycle(outgoer, visited)) {
        return true;
      }
    }
  };

  if (target.id === connection.source) {
    return false;
  }
  return hasCycle(target);
}
