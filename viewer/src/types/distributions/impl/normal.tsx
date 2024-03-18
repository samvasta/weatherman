import { Heading } from "@/components/primitives/text/Heading";
import { Txt } from "@/components/primitives/text/Text";

import { NormalIcon } from "@/components/icons/distributions/NormalIcon";

import { type NormalData } from "@/types/distributions";

export function NormalDistribution({ data }: { data: NormalData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.mean}{" "}
        <Txt intent="subtle" as="span" size="md">
          {data.stdDev}
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
