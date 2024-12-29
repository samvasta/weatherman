import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { UniformIcon } from "@/components/icons/distributions/UniformIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { type UniformData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function UniformDistribution({ data }: { data: UniformData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {formatNumber(data.min)} - {formatNumber(data.max)}
      </Heading>
      <UniformIcon label="Uniform" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function UniformDistributionPreview({ data }: { data: UniformData }) {
  return (
    <>
      <UniformIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="sm">Random Value</Heading>
    </>
  );
}

export function UniformDistributionProperties({
  data,
  onChange,
}: {
  data: UniformData;
  onChange: (nextData: UniformData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
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
