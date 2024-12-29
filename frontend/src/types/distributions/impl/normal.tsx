import React from "react";

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

const NormalSchema = z.object({
  type: z.literal(DistributionType.Normal),
  mean: z.number().finite(),
  stdDev: z
    .number()
    .finite()
    .nonnegative("Standard deviation cannot be negative."),

  meanSheetEditable: z.boolean(),
  stdDevSheetEditable: z.boolean(),
});

type NormalData = z.infer<typeof NormalSchema>;
function isNormal(
  distribution: CommonDistributionInfoData
): distribution is NormalData {
  return distribution.type === DistributionType.Normal;
}

function NormalDistribution({ data }: { data: NormalData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {formatNumber(data.mean)}{" "}
        <Txt intent="subtle" as="span" size="md">
          ±{formatNumber(data.stdDev)}
        </Txt>
      </Heading>
      <NormalIcon label="Normal" size="xl" className="text-neutral-10" />
    </div>
  );
}

function NormalDistributionPreview({ data }: { data: NormalData }) {
  return (
    <>
      <NormalIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="sm">Bell Curve</Heading>
    </>
  );
}

function NormalDistributionProperties({
  data,
  onChange,
}: {
  data: NormalData;
  onChange: (nextData: NormalData) => void;
}) {
  const p10 = data.mean - 1.285 * data.stdDev;
  const p90 = data.mean + 1.285 * data.stdDev;

  const [pendingLow, setPendingLow] = React.useState(p10);
  const [pendingHigh, setPendingHigh] = React.useState(p90);

  React.useEffect(() => {
    setPendingHigh(p90);
    setPendingLow(p10);
  }, [p90, p10]);

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
      <Heading>Range</Heading>
      <Txt intent="subtle">
        Set these numbers so that 80% of all possible scenarios will be in this
        range.
        <br />
        <br />
        Alternatively, you can think of it as a 1 in 10 chance of the value
        being higher than the bigger value, and a 1 in 10 chance of the value
        being lower than the smaller value.
      </Txt>
      <Heading size="xs">Low</Heading>
      <NumberInput
        value={pendingLow}
        onChange={(value) => setPendingLow(value)}
        onBlur={(e) => {
          onChange({
            ...data,
            stdDev: (Number(pendingLow) - data.mean) / -1.285,
          });
        }}
      />
      <Heading size="xs">High</Heading>
      <NumberInput
        value={pendingHigh}
        onChange={(value) => setPendingHigh(Number(value))}
        onBlur={(e) =>
          onChange({
            ...data,
            stdDev: (Number(pendingHigh) - data.mean) / 1.285,
          })
        }
      />
    </div>
  );
}

export const NormalInfo: DistributionInfo<NormalData> = {
  checkType: isNormal,
  defaultConfig: {
    type: DistributionType.Normal,
    mean: 1,
    stdDev: 0.5,

    meanSheetEditable: true,
    stdDevSheetEditable: true,
  },
  DistributionNodeContent: NormalDistribution,
  DistributionPreviewContent: NormalDistributionPreview,
  DistributionProperties: NormalDistributionProperties,
  schema: NormalSchema,
};
