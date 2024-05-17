import { Heading } from "@/components/primitives/text/Heading";

import {
  DistributionType,
  getDefaultDistributionData,
} from "@/types/distributions";
import {
  AllVariables,
  type AnyVariableData,
} from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";
import { type IVarData } from "@/types/variables/impl/ivar";

import { nanoid } from "nanoid";
import { VariableNodePreview } from "../VariableNode";

export function NodePaletteToolbar() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    data: AnyVariableData
  ) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="max-w-full select-none">
      <div className="flex w-full flex-col gap-2 p-4 select-none">
        <div className="flex flex-col select-none">
          <Heading size="lg">Inputs</Heading>
          <div className="grid grid-cols-2 grow gap-2">
            {Object.values(DistributionType).map((distributionType) => {
              const info = AllVariables[VariableType.IVar];

              const data = {
                ...info.defaultConfig,
                name: `New ${distributionType}`,
                distribution: getDefaultDistributionData(distributionType),
                ui: {
                  id: nanoid(8),
                  x: 0,
                  y: 0,
                  isOutputFloating: false,
                },
              } as IVarData;
              return (
                <VariableNodePreview
                  key={distributionType}
                  data={data}
                  onDragStart={(event) => onDragStart(event, data)}
                  draggable
                  className="w-full select-none"
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col select-none">
          <Heading size="lg">Operators</Heading>
          <div className="grid grid-cols-2 grow gap-2">
            {Object.values(VariableType)
              .filter(
                (t) => t !== VariableType.IVar && t !== VariableType.Collector
              )
              .map((varType) => {
                const info = AllVariables[varType];
                return info.defaultConfig as AnyVariableData;
              })
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((data) => {
                return (
                  <VariableNodePreview
                    key={data.type}
                    data={data}
                    onDragStart={(event) =>
                      onDragStart(event, {
                        ...data,
                        ui: {
                          id: nanoid(8),
                          x: 0,
                          y: 0,
                          isOutputFloating: false,
                        },
                      })
                    }
                    draggable
                    className="w-full select-none"
                  />
                );
              })}
          </div>
        </div>
        <div className="flex flex-col select-none">
          <Heading size="lg">Results</Heading>
          <VariableNodePreview
            key="collector"
            data={
              AllVariables[VariableType.Collector]
                .defaultConfig as AnyVariableData
            }
            onDragStart={(event) =>
              onDragStart(event, {
                ...(AllVariables[VariableType.Collector]
                  .defaultConfig as AnyVariableData),
                ui: {
                  id: nanoid(8),
                  x: 0,
                  y: 0,
                  isOutputFloating: false,
                },
              })
            }
            draggable
            className="w-full select-none grow"
          />
        </div>
      </div>
    </div>
  );
}
