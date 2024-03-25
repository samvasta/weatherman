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
import { useHorizontalScroll } from "@/utils/useHorizontalScroll";

import { VariableNodePreview } from "../VariableNode";

export function NodePaletteToolbar() {
  const ref = useHorizontalScroll(0.4);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    data: AnyVariableData
  ) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="max-w-full overflow-auto" ref={ref}>
      <div className="flex w-full flex-col gap-2 p-4">
        <div className="flex flex-col">
          <Heading size="lg">Inputs</Heading>
          <div className="flex grow flex-col gap-2">
            {Object.values(DistributionType).map((distributionType) => {
              const info = AllVariables[VariableType.IVar];

              const data = {
                ...info.defaultConfig,
                name: `New ${distributionType}`,
                distribution: getDefaultDistributionData(distributionType),
              } as IVarData;
              return (
                <VariableNodePreview
                  key={distributionType}
                  data={data}
                  onDragStart={(event) => onDragStart(event, data)}
                  draggable
                  className="w-full"
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <Heading size="lg">Operators</Heading>
          <div className="flex grow flex-col gap-2">
            {Object.values(VariableType)
              .filter(
                (t) => t !== VariableType.IVar && t !== VariableType.Collector
              )
              .map((varType) => {
                const info = AllVariables[varType];
                const data = info.defaultConfig as AnyVariableData;
                return (
                  <VariableNodePreview
                    key={varType}
                    data={data}
                    onDragStart={(event) => onDragStart(event, data)}
                    draggable
                    className="w-full"
                  />
                );
              })}
          </div>
        </div>
        <div className="flex flex-col">
          <Heading size="lg">Results</Heading>
          <VariableNodePreview
            key="collector"
            data={
              AllVariables[VariableType.Collector]
                .defaultConfig as AnyVariableData
            }
            onDragStart={(event) =>
              onDragStart(
                event,
                AllVariables[VariableType.Collector]
                  .defaultConfig as AnyVariableData
              )
            }
            draggable
            className="w-full grow"
          />
        </div>
      </div>
    </div>
  );
}
