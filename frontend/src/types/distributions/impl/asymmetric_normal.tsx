import React from "react";

import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { AsymmetricNormalIcon } from "@/components/icons/distributions/AsymmetricNormalIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { type AsymmetricNormalData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function AsymmetricNormalDistribution({
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

export function AsymmetricNormalDistributionPreview({
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

export function AsymmetricNormalDistributionProperties({
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
