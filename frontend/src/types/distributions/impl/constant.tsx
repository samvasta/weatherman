import { z } from "zod";

import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { ConstantIcon } from "@/components/icons/distributions/ConstantIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { formatNumber } from "@/utils/numberFormat";

import {
  CommonDistributionInfoData,
  DistributionInfo,
  DistributionType,
} from "../common";

const ConstantSchema = z.object({
  type: z.literal(DistributionType.Constant),
  value: z.number().finite(),
  sheetEditable: z.boolean(),
});

type ConstantData = z.infer<typeof ConstantSchema>;
function isConstant(
  distribution: CommonDistributionInfoData
): distribution is ConstantData {
  return distribution.type === DistributionType.Constant;
}

function ConstantDistribution({ data }: { data: ConstantData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">{formatNumber(data.value)}</Heading>
      <ConstantIcon label="Constant" size="xl" className="text-neutral-10" />
    </div>
  );
}

function ConstantDistributionPreview({ data }: { data: ConstantData }) {
  return (
    <>
      <ConstantIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="sm">Constant Value</Heading>
    </>
  );
}

function ConstantDistributionProperties({
  data,
  onChange,
}: {
  data: ConstantData;
  onChange: (nextData: ConstantData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading size="xs">Value</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="sheetEditable"
      >
        <NumberInput
          value={data.value}
          onChange={(value) =>
            onChange({
              ...data,
              value,
            })
          }
        />
      </SheetEditableInput>
    </div>
  );
}

export const ConstantInfo: DistributionInfo<ConstantData> = {
  checkType: isConstant,
  defaultConfig: {
    sheetEditable: true,
    type: DistributionType.Constant,
    value: 1,
  },
  DistributionNodeContent: ConstantDistribution,
  DistributionPreviewContent: ConstantDistributionPreview,
  DistributionProperties: ConstantDistributionProperties,
  schema: ConstantSchema,
};
