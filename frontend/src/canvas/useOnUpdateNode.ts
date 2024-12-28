import React from "react";

import { useSetAtom } from "jotai";
import {
  type Node,
  useNodes,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";

import { type AnyVariableData } from "@/types/variables/allVariables";

import { setCompiledModelAtom } from "./atoms";
import { graphToModel } from "./graphToModel";
import { VariableEdgeType, type VariableNodeType } from "./useNodesAndEdges";

function replaceName(
  input: unknown,
  oldName: string,
  newName: string
): unknown {
  if (input === oldName) {
    return newName;
  }

  if (input === null || input === undefined) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((i) => (i === oldName ? newName : i) as unknown);
  }

  if (typeof input === "object") {
     
    return Object.entries(input)
      .map(([key, value]) =>
        key === "type"
          ? // Never overwrite `type` properties
            ([key, value] as [string, unknown])
          : ([key, replaceName(value, oldName, newName)] as [string, unknown])
      )
      .reduce(
        (acc, [k, v]) => {
          acc[k] = v;
          return acc;
        },
        {} as Record<string, unknown>
      );
  }

  return input;
}

export function useOnUpdateNode(data: AnyVariableData) {
  const nodes = useNodes();
  const { setNodes, getEdges } = useReactFlow<VariableNodeType,VariableEdgeType>();

  const updateNodeInternals = useUpdateNodeInternals();

  const updateCompiledModel = useSetAtom(setCompiledModelAtom);
  const node = nodes.find((n) => n.id === data.ui.id);

  return {
    onUpdateNode: React.useCallback(
      (
        nextData: Partial<AnyVariableData>,
        otherProps: Partial<Omit<Node<AnyVariableData>, "data">> = {}
      ) => {
        setNodes((nodes) => {
          const list: VariableNodeType[] = (nodes as VariableNodeType[]).map(
            (n) => {
              if (n.id === data.ui.id) {
                return {
                  ...n,
                  ...otherProps,
                  data: { ...n.data, ...nextData },
                } as VariableNodeType;
              } else {
                if (nextData.name) {
                  return {
                    ...n,
                    data: replaceName(n.data, data.name, nextData.name),
                  } as VariableNodeType;
                } else {
                  return n;
                }
              }
            }
          );

          updateCompiledModel(graphToModel(list, getEdges()));

          return list;
        });
        updateNodeInternals(data.ui.id);
      },
      [
        setNodes,
        updateNodeInternals,
        data.ui.id,
        data.name,
        updateCompiledModel,
        getEdges,
      ]
    ),
    node,
  };
}
