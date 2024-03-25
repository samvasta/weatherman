import React from "react";

import { useSetAtom } from "jotai";
import { useNodes, useReactFlow, useUpdateNodeInternals } from "reactflow";

import { EmptyState } from "@/components/empty/EmptyState";

import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";

import { compiledModelAtom } from "../atoms";
import { graphToModel } from "../graphToModel";
import { type VariableNodeType } from "../useNodesAndEdges";

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

export function NodePropertiesToolbar({
  selected,
}: {
  selected: VariableNodeType;
}) {
  const info = AllVariables[selected.data.type];

  const updateNodeInternals = useUpdateNodeInternals();

  const updateCompiledModel = useSetAtom(compiledModelAtom);
  const { setNodes, getEdges } = useReactFlow();

  const nodes = useNodes();

  const node = React.useMemo(
    () => nodes.find((n) => n.id === selected.id),
    [nodes, selected.id]
  );

  const onUpdateNode = React.useCallback(
    (nextData: Partial<AnyVariableData>) => {
      setNodes((nodes) => {
        const list: VariableNodeType[] = (nodes as VariableNodeType[]).map(
          (n) => {
            if (n.id === selected.id) {
              return {
                ...n,
                data: { ...n.data, ...nextData },
              } as VariableNodeType;
            } else {
              if (nextData.name) {
                return {
                  ...n,
                  data: replaceName(n.data, selected.data.name, nextData.name),
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
      updateNodeInternals(selected.id);
    },
    [
      setNodes,
      updateNodeInternals,
      selected.id,
      selected.data.name,
      updateCompiledModel,
      getEdges,
    ]
  );

  if (!node) {
    return <EmptyState heading="Invalid Node" />;
  }

  return (
    <div className="flex w-fit max-w-[50vw] flex-col gap-2 overflow-y-auto p-4">
      <info.VariableProperties data={node.data} onChange={onUpdateNode} />
    </div>
  );
}
