import { z } from "zod";

import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { NormalIcon } from "@/components/icons/distributions/NormalIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { formatNumber } from "@/utils/numberFormat";

import {
  CommonDistributionInfoData,
  DistributionInfo,
  DistributionType,
} from "../common";

const LaplaceSchema = z.object({
  type: z.literal(DistributionType.Laplace),
  mean: z.number().finite(),
  stdDev: z
    .number()
    .finite()
    .nonnegative("Standard deviation cannot be negative."),

  meanSheetEditable: z.boolean(),
  stdDevSheetEditable: z.boolean(),
});

type LaplaceData = z.infer<typeof LaplaceSchema>;
function isLaplace(
  distribution: CommonDistributionInfoData
): distribution is LaplaceData {
  return distribution.type === DistributionType.Laplace;
}

function LaplaceDistribution({ data }: { data: LaplaceData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {formatNumber(data.mean)}{" "}
        <Txt intent="subtle" as="span" size="md">
          {formatNumber(data.stdDev)}
        </Txt>
      </Heading>
      <NormalIcon label="Laplace" size="xl" className="text-neutral-10" />
    </div>
  );
}

function LaplaceDistributionPreview({ data }: { data: LaplaceData }) {
  return (
    <>
      <NormalIcon label="Laplace" size="xl" className="text-neutral-10" />
      <Heading size="sm">Laplace</Heading>
    </>
  );
}

function LaplaceDistributionProperties({
  data,
  onChange,
}: {
  data: LaplaceData;
  onChange: (nextData: LaplaceData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading size="xs">Mean</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="meanSheetEditable"
      >
        <NumberInput
          value={data.mean}
          onChange={(value) =>
            onChange({
              ...data,
              mean: value,
            })
          }
        />
      </SheetEditableInput>
      <Heading size="xs">Standard Deviation</Heading>

      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="stdDevSheetEditable"
      >
        <NumberInput
          value={data.stdDev}
          onChange={(value) =>
            onChange({
              ...data,
              stdDev: value,
            })
          }
        />
      </SheetEditableInput>
    </div>
  );
}

export const LaplaceInfo: DistributionInfo<LaplaceData> = {
  checkType: isLaplace,
  defaultConfig: {
    type: DistributionType.Laplace,
    mean: 1,
    stdDev: 0.5,

    meanSheetEditable: true,
    stdDevSheetEditable: true,
  },
  DistributionNodeContent: LaplaceDistribution,
  DistributionPreviewContent: LaplaceDistributionPreview,
  DistributionProperties: LaplaceDistributionProperties,
  schema: LaplaceSchema,
};
