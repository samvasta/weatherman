import React from "react";

import { z } from "zod";

import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { AsymmetricNormalIcon } from "@/components/icons/distributions/AsymmetricNormalIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { formatNumber } from "@/utils/numberFormat";

import {
  CommonDistributionInfoData,
  DistributionInfo,
  DistributionType,
} from "../common";

const AsymmetricNormalSchema = z
  .object({
    type: z.literal(DistributionType.AsymmetricNormal),
    mean: z.number().finite(),
    stdDevLow: z
      .number()
      .finite()
      .nonnegative("Standard deviation cannot be negative."),
    stdDevHigh: z
      .number()
      .finite()
      .nonnegative("Standard deviation cannot be negative."),
    min: z.number().finite(),
    max: z.number().finite(),

    meanSheetEditable: z.boolean(),
    stdDevLowSheetEditable: z.boolean(),
    stdDevHighSheetEditable: z.boolean(),
    minSheetEditable: z.boolean(),
    maxSheetEditable: z.boolean(),
  })
  .superRefine(({ min, max, mean, stdDevLow, stdDevHigh }, ctx) => {
    if (min >= max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        inclusive: false,
        message: "The minimum value must be less than the maximum value",
      });
    }
    if (mean <= min) {
      ctx.addIssue({
        code: "too_small",
        minimum: min,
        type: "number",
        inclusive: false,
        message: "The mean value must be greater than the minimum value",
      });
    }
    if (mean >= max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        inclusive: false,
        message: "The mean value must be less than the maximum value",
      });
    }
  });

type AsymmetricNormalData = z.infer<typeof AsymmetricNormalSchema>;
function isAsymmetricNormal(
  distribution: CommonDistributionInfoData
): distribution is AsymmetricNormalData {
  return distribution.type === DistributionType.AsymmetricNormal;
}

function AsymmetricNormalDistribution({
  data,
}: {
  data: AsymmetricNormalData;
}) {
  const p10 = data.mean - 1.285 * data.stdDevLow;
  const p90 = data.mean + 1.285 * data.stdDevHigh;
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        <Txt intent="subtle" as="span" size="md">
          {formatNumber(p10)}
        </Txt>{" "}
        {formatNumber(data.mean)}{" "}
        <Txt intent="subtle" as="span" size="md">
          {formatNumber(p90)}
        </Txt>
      </Heading>
      <AsymmetricNormalIcon
        label="AsymmetricNormal"
        size="xl"
        className="text-neutral-10"
      />
    </div>
  );
}

function AsymmetricNormalDistributionPreview({
  data,
}: {
  data: AsymmetricNormalData;
}) {
  return (
    <>
      <AsymmetricNormalIcon
        label="AsymmetricNormal"
        size="xl"
        className="text-neutral-10"
      />
      <Heading size="sm">Asymmetric</Heading>
    </>
  );
}

function AsymmetricNormalDistributionProperties({
  data,
  onChange,
}: {
  data: AsymmetricNormalData;
  onChange: (nextData: AsymmetricNormalData) => void;
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
      <Heading size="sm">Range</Heading>
      <Txt intent="subtle">
        Set these numbers so that 80% of all possible scenarios will be in this
        range.
        <br />
        <br />
        Alternatively, you can think of it as a 1 in 10 chance of the value
        being higher than the bigger value, and a 1 in 10 chance of the value
        being lower than the smaller value.
      </Txt>
      <Heading size="xs">Minimum</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="minSheetEditable"
      >
        <NumberInput
          value={data.min}
          onChange={(value) =>
            onChange({
              ...data,
              min: value,
            })
          }
        />
      </SheetEditableInput>
      <Heading size="xs">Low</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="stdDevLowSheetEditable"
      >
        <NumberInput
          value={data.mean - 1.285 * data.stdDevLow}
          onChange={(value) =>
            onChange({
              ...data,
              stdDevLow: (Number(value) - data.mean) / -1.285,
            })
          }
        />
      </SheetEditableInput>
      <Heading size="xs">High</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="stdDevHighSheetEditable"
      >
        <NumberInput
          value={data.mean + 1.285 * data.stdDevHigh}
          onChange={(value) =>
            onChange({
              ...data,
              stdDevHigh: (Number(value) - data.mean) / 1.285,
            })
          }
        />
      </SheetEditableInput>
      <Heading size="xs">Maximum</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="maxSheetEditable"
      >
        <NumberInput
          value={data.max}
          onChange={(value) =>
            onChange({
              ...data,
              max: value,
            })
          }
        />
      </SheetEditableInput>
    </div>
  );
}

export const AsymmetricNormalInfo: DistributionInfo<AsymmetricNormalData> = {
  checkType: isAsymmetricNormal,
  defaultConfig: {
    type: DistributionType.AsymmetricNormal,
    mean: 5,
    stdDevLow: 3 / 1.285,
    stdDevHigh: 3 / 1.285,
    min: 0,
    max: 10,

    minSheetEditable: true,
    maxSheetEditable: true,
    meanSheetEditable: true,
    stdDevLowSheetEditable: true,
    stdDevHighSheetEditable: true,
  },
  DistributionNodeContent: AsymmetricNormalDistribution,
  DistributionPreviewContent: AsymmetricNormalDistributionPreview,
  DistributionProperties: AsymmetricNormalDistributionProperties,
  schema: AsymmetricNormalSchema,
};
