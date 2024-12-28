import { nanoid } from "nanoid";

import { Heading } from "@/components/primitives/text/Heading";

import {
  DistributionType,
  getDefaultDistributionData,
} from "@/types/distributions";
import {
  AllVariables,
  type AnyVariableData,
  VariableGroups,
} from "@/types/variables/allVariables";
import { VariableType } from "@/types/variables/common";
import { type IVarData } from "@/types/variables/impl/ivar";

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
      <div className="flex w-full select-none flex-col gap-2 p-4">
        <div className="flex select-none flex-col">
          <Heading size="lg">Inputs</Heading>
          <div className="grid grow grid-cols-2 gap-2">
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
        {Object.entries(VariableGroups).map(([group, variables]) => {
          if (group === "Variables") {
            return null;
          }
          return (
            <div className="flex select-none flex-col" key={group}>
              <Heading size="lg">{group}</Heading>
              <div className="grid grow grid-cols-2 gap-2">
                {variables
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
          );
        })}
      </div>
    </div>
  );
}