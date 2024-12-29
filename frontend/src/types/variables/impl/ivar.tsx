import React from "react";

import { useAtomValue } from "jotai";
import { PlusIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/primitives/button/Button";
import { CheckboxWithLabel } from "@/components/primitives/checkbox/Checkbox";
import { Input } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import { inputSheetsAtom } from "@/state/model.atoms";
import {
  AllDistributions,
} from "@/types/distributions/allDistributions";
import { ConstantInfo } from "@/types/distributions/impl/constant";
import {
  DEFAULT_COMMON_DATA,
  type VariableInfo,
  type VariablePropertiesProps,
  VariableType,
} from "@/types/variables/common";
import { isIVar, IVarSchema, type IVarData } from "../ivarCommon";


function IVarNode({ data }: { data: IVarData }) {
  const Content =
    AllDistributions[data.distribution.type].DistributionNodeContent;
  return (
    <div className="flex flex-col px-6 py-3">
      <CommonVariableInfo info={data} />
      <Content data={data.distribution} />
    </div>
  );
}

function IVarNodePreview({ data }: { data: IVarData }) {
  const Content =
    AllDistributions[data.distribution.type].DistributionPreviewContent;
  return (
    <div className="flex items-center gap-2 px-2 py-1 ">
      <Content data={data.distribution} />
    </div>
  );
}

function IVarProperties({ data, onChange }: VariablePropertiesProps<IVarData>) {
  const Content =
    AllDistributions[data.distribution.type].DistributionProperties;

  const [pendingSheetName, setPendingSheetName] = React.useState("");

  const sheets = useAtomValue(inputSheetsAtom);

  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Content
        key={data.ui.id}
        data={data.distribution}
        onChange={(nextDistribution) =>
          onChange({
            distribution: nextDistribution as IVarData["distribution"],
          })
        }
      />

      <Heading size="md" className="mt-regular">
        Input Sheets
      </Heading>
      <Txt intent="subtle">
        You can add this input to an input sheet. Input sheets are convenient
        ways to twist and turn the knobs of your model.
      </Txt>
      {Object.entries(sheets).map(([sheetName, variables]) => {
        const isChecked = Boolean(variables.find((v) => v.name === data.name));
        return (
          <CheckboxWithLabel
            key={sheetName}
            checked={isChecked}
            colorScheme="primary"
            onCheckedChange={(checked) => {
              if (checked && !isChecked) {
                onChange({
                  ...data,
                  inputSheetIds: [...data.inputSheetIds, sheetName],
                });
              } else if (!checked && isChecked) {
                onChange({
                  ...data,
                  inputSheetIds: data.inputSheetIds.filter(
                    (s) => s !== sheetName
                  ),
                });
              }
            }}
          >
            {sheetName}
          </CheckboxWithLabel>
        );
      })}

      <div className="flex gap-2">
        <Input
          value={pendingSheetName}
          onChange={(e) => setPendingSheetName(e.target.value)}
          variant="flushed"
          className="min-w-48"
          placeholder="New sheet name"
        />
        <Button
          disabled={!pendingSheetName || pendingSheetName in sheets}
          colorScheme="neutral"
          variant="ghost"
          className="w-fit text-nowrap"
          onClick={() => {
            onChange({
              ...data,
              inputSheetIds: [...data.inputSheetIds, pendingSheetName],
            });
            setPendingSheetName("");
          }}
        >
          <PlusIcon />
          Add to new sheet
        </Button>
      </div>
    </WithCommonProperties>
  );
}

export const IVarInfo: VariableInfo<IVarData> = {
  checkType: isIVar,
  schema: IVarSchema as z.ZodSchema<IVarData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "one",
    type: VariableType.IVar,
    distribution: ConstantInfo.defaultConfig,
    inputSheetIds: [],
  },
  hasOutput: true,
  getInputs: (_) => ({}),
  getPorts: (_) => [],
  VariableContent: IVarNode,
  VariablePreviewContent: IVarNodePreview,
  VariableProperties: IVarProperties,
};
