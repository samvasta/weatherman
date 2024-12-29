import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { NormalIcon } from "@/components/icons/distributions/NormalIcon";

import { type LaplaceData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function LaplaceDistribution({ data }: { data: LaplaceData }) {
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

export function LaplaceDistributionPreview({ data }: { data: LaplaceData }) {
  return (
    <>
      <NormalIcon label="Laplace" size="xl" className="text-neutral-10" />
      <Heading size="sm">Laplace</Heading>
    </>
  );
}

export function LaplaceDistributionProperties({
  data,
  onChange,
}: {
  data: LaplaceData;
  onChange: (nextData: LaplaceData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading size="xs">Mean</Heading>
      <NumberInput
        value={data.mean}
        onChange={(value) =>
          onChange({
            ...data,
            mean: value,
          })
        }
      />
      <Heading size="xs">Standard Deviation</Heading>
      <NumberInput
        value={data.stdDev}
        onChange={(value) =>
          onChange({
            ...data,
            stdDev: value,
          })
        }
      />
    </div>
  );
}
