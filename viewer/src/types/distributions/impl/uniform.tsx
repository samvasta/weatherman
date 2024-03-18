import { Heading } from "@/components/primitives/text/Heading";

import { UniformIcon } from "@/components/icons/distributions/UniformIcon";

import { type UniformData } from "@/types/distributions";

export function UniformDistribution({ data }: { data: UniformData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.min} - {data.max}
      </Heading>
      <UniformIcon label="Uniform" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function UniformDistributionPreview({ data }: { data: UniformData }) {
  return (
    <>
      <UniformIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="md">Random Value</Heading>
    </>
  );
}
