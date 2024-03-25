import React from "react";

import { Input } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { NormalIcon } from "@/components/icons/distributions/NormalIcon";

import { type NormalData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function NormalDistribution({ data }: { data: NormalData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {formatNumber(data.mean)}{" "}
        <Txt intent="subtle" as="span" size="md">
          {formatNumber(data.stdDev)}
        </Txt>
      </Heading>
      <NormalIcon label="Normal" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function NormalDistributionPreview({ data }: { data: NormalData }) {
  return (
    <>
      <NormalIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="md">Bell Curve</Heading>
    </>
  );
}

export function NormalDistributionProperties({
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
      <Heading>Mean</Heading>
      <Input
        value={data.mean}
        type="number"
        onChange={(e) =>
          onChange({
            ...data,
            mean: Number(e.target.value),
          })
        }
      />
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
      <Input
        value={pendingLow}
        type="number"
        onChange={(e) => setPendingLow(Number(e.target.value))}
        onBlur={(e) => {
          onChange({
            ...data,
            stdDev: (Number(pendingLow) - data.mean) / -1.285,
          });
        }}
      />
      <Heading size="xs">High</Heading>
      <Input
        value={pendingHigh}
        type="number"
        onChange={(e) => setPendingHigh(Number(e.target.value))}
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
