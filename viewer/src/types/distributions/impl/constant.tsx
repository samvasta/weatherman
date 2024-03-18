import { Heading } from "@/components/primitives/text/Heading";

import { ConstantIcon } from "@/components/icons/distributions/ConstantIcon";

import { type ConstantData } from "@/types/distributions";

export function ConstantDistribution({ data }: { data: ConstantData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">{data.value}</Heading>
      <ConstantIcon label="Constant" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function ConstantDistributionPreview({ data }: { data: ConstantData }) {
  return (
    <>
      <ConstantIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="md">Constant Value</Heading>
    </>
  );
}
