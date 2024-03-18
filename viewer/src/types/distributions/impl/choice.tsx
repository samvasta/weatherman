import { Heading } from "@/components/primitives/text/Heading";

import { ChoiceIcon } from "@/components/icons/distributions/ChoiceIcon";

import { type ChoiceData } from "@/types/distributions";

export function ChoiceDistribution({ data }: { data: ChoiceData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.options.map((opt) => opt.value).join(", ")}
      </Heading>
      <ChoiceIcon label="Choice" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function ChoiceDistributionPreview({ data }: { data: ChoiceData }) {
  return (
    <>
      <ChoiceIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="md">Spin the wheel</Heading>
    </>
  );
}
