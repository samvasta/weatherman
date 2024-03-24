import React, { type HTMLAttributes } from "react";

import { useAtomValue } from "jotai";
import { TrashIcon, TriangleAlertIcon } from "lucide-react";
import {
  Handle,
  type NodeProps,
  Position,
  useEdges,
  useReactFlow,
  useStore,
} from "reactflow";

import { IconButton } from "@/components/primitives/button/Button";
import { Tooltip } from "@/components/primitives/floating/tooltip/Tooltip";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { sizeLookup } from "@/components/icons/createIcon";

import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";
import { cn } from "@/utils/tailwind";

import {
  isSimulatedAtom,
  nodeIdToNameAtom,
  useNodeErrors,
  useSimulationResultForNode,
} from "./atoms";
import { OUTPUT_PORT_NAME, PORT_NAME_SEPARATOR } from "./useNodesAndEdges";

export const VariableNode = React.memo(
  ({ id, data, selected }: NodeProps<AnyVariableData>) => {
    const info = AllVariables[data.type];

    const { setNodes } = useReactFlow();

    const addSelectedNodes = useStore((state) => state.addSelectedNodes);

    const onDeleteClick = () => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    };

    const edges = useEdges();
    const targetPorts = info.getPorts(data);

    const hasOutput = info.hasOutput;

    const Content = info.VariableContent;

    const nodeIdsToNames = useAtomValue(nodeIdToNameAtom);

    const { errors, hasError } = useNodeErrors(data.name);

    const results = useSimulationResultForNode(data.name);
    const isSimulated = useAtomValue(isSimulatedAtom);

    return (
      <div
        className={cn(
          "grid min-w-20 rounded-sm border bg-neutral-1 text-neutral-13 shadow-md",
          isSimulated && "border-neutral-4 bg-neutral-2 text-neutral-10",
          !hasError &&
            results !== null &&
            "border-info-9 bg-info-2 text-info-12 scheme-info",

          selected &&
            !hasError &&
            results === null &&
            "border-primary-9 bg-primary-2 text-primary-12 scheme-primary",

          selected &&
            hasError &&
            "border-warning-11 text-warning-12 scheme-warning"
        )}
        style={{
          minHeight: (targetPorts.length + 1) * 24 + 32,
        }}
      >
        <div className="targets absolute top-0 flex h-full w-2 flex-col justify-evenly py-2">
          {targetPorts.map((port) => {
            const edge = edges.filter(
              (e) =>
                e.target === id &&
                e.targetHandle === `${id}${PORT_NAME_SEPARATOR}${port.name}`
            );

            return (
              <div
                key={port.name}
                className={cn(
                  "!relative !-left-0.5 !top-0 !-translate-x-[100%] !translate-y-0 ",
                  isSimulated && "pointer-events-none"
                )}
              >
                <Txt
                  className="absolute bottom-2 right-1 w-fit leading-none"
                  size="xs"
                >
                  {selected && edge && edge.length === 1 ? (
                    <>
                      <span
                        onClick={() => {
                          addSelectedNodes([edge[0]!.source]);
                        }}
                      >
                        {nodeIdsToNames[edge[0]!.source]}
                      </span>
                      <Txt as="span" intent="subtle" className="scheme-neutral">
                        ({port.name})
                      </Txt>
                    </>
                  ) : targetPorts.length > 1 ? (
                    port.name.length > 1 && port.name
                  ) : null}
                </Txt>
                <Handle
                  id={`${id}${PORT_NAME_SEPARATOR}${port.name}`}
                  type="target"
                  position={Position.Left}
                  className={cn(
                    "!absolute !left-0 !h-3 !w-2  !rounded-r-none !border-0 !border-cur-scheme-12 !bg-cur-scheme-12",
                    isSimulated && "!border-cur-scheme-10 !bg-cur-scheme-10"
                  )}
                ></Handle>
              </div>
            );
          })}
        </div>
        <div className="relative h-full w-full">
          <Content data={data} />
        </div>
        <div
          className={cn(
            "sources absolute right-0 top-0 flex h-full w-3 flex-col justify-around",
            isSimulated && "pointer-events-none"
          )}
        >
          {hasOutput && (
            <Handle
              key={OUTPUT_PORT_NAME}
              id={`${id}${PORT_NAME_SEPARATOR}${OUTPUT_PORT_NAME}`}
              type="source"
              position={Position.Right}
              className={cn(
                "!border-0-2 !relative !-right-1 !top-0 !h-3 !w-2 !translate-x-[100%] !translate-y-0 !rounded-l-none !border-0 !border-cur-scheme-12 !bg-cur-scheme-12",
                isSimulated && "!border-cur-scheme-10 !bg-cur-scheme-10"
              )}
            />
          )}
        </div>

        {selected && !isSimulated && (
          <IconButton
            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full border border-neutral-9 bg-neutral-1 text-neutral-10 hover:border-danger-10 hover:bg-danger-3 hover:text-danger-12"
            variant="ghost"
            onClick={onDeleteClick}
          >
            <TrashIcon size={sizeLookup.xs.width} className="stroke-current" />
          </IconButton>
        )}
        {hasError && (
          <Tooltip
            colorScheme="warning"
            content={
              <div className="flex flex-col">
                <Heading size="md">Errors:</Heading>
                {errors.map((e, i) => (
                  <div key={`error-${i}`}>
                    <Txt size="md">{e.message}</Txt>
                  </div>
                ))}
              </div>
            }
          >
            <div className="bg-warning-9 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2  rounded-full p-1 text-neutral-12">
              <TriangleAlertIcon
                size={sizeLookup.xs.width}
                className="stroke-current"
              />
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);
VariableNode.displayName = "VariableNode";

export const VariableNodePreview = React.memo(
  ({
    data,
    className,
    ...rest
  }: { data: AnyVariableData } & HTMLAttributes<HTMLDivElement>) => {
    const info = AllVariables[data.type];
    const Content = info.VariablePreviewContent;

    return (
      <div
        className={cn(
          "rounded-sm border bg-neutral-1 text-neutral-13 shadow-md",
          className
        )}
        {...rest}
      >
        <div className="relative h-full w-full">
          <Content data={data} />
        </div>
      </div>
    );
  }
);
VariableNodePreview.displayName = "VariableNodePreview";
