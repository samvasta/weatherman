import { type Model } from "@/types/model";
import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";

import {
  PORT_NAME_SEPARATOR,
  type VariableEdgeType,
  type VariableNodeType,
} from "./useNodesAndEdges";

export function graphToModel(
  nodes: VariableNodeType[],
  edges: VariableEdgeType[]
): Model {
  const allVariables: { [id: string]: AnyVariableData } = nodes.reduce(
    (map, node) => {
      const type = node.data.type;

      const info = AllVariables[type];

      const blankNode = { ...node.data };

      for (const port of info.getPorts(node.data)) {
        switch (port.connectionStrategy) {
          case "append": {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (blankNode as any)[port.name] = [];
            break;
          }
          case "block":
            break;
          case "overwrite": {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (blankNode as any)[port.name] = "";
            break;
          }
        }
      }

      map[node.id] = blankNode;

      return map;
    },
    {} as { [id: string]: AnyVariableData }
  );

  for (const edge of edges) {
    const fromId = edge.source;
    const toId = edge.target;
    const toPort = edge.targetHandle?.split(PORT_NAME_SEPARATOR)[1];

    const from = allVariables[fromId];
    const to = allVariables[toId];

    if (!from || !to) {
      throw new Error(
        `Couldn't find both sides of the edge from=${from?.name} to=${to?.name}`
      );
    }

    const type = to.type;

    const info = AllVariables[type];

    const port = info.getPorts(to).find((p) => p.name === toPort);

    if (!port) {
      throw new Error("Couldn't find port " + toPort);
    }

    switch (port.connectionStrategy) {
      case "append": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (to as any)[port.name].push(from.name);
        break;
      }
      case "block":
        break;
      case "overwrite": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (to as any)[port.name] = from.name;
        break;
      }
    }
  }

  return {
    variables: Object.values(allVariables),
  };
}
