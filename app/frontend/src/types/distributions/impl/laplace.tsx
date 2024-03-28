import { Input } from "@/components/primitives/input/Input";
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
      <Heading size="md">Laplace</Heading>
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
      <Heading size="xs">Standard Deviation</Heading>
      <Input
        value={data.stdDev}
        type="number"
        onChange={(e) =>
          onChange({
            ...data,
            stdDev: Number(e.target.value),
          })
        }
      />
    </div>
  );
}
