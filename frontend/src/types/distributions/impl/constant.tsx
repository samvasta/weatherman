import { LockIcon, LockOpenIcon } from "lucide-react";

import { Checkbox } from "@/components/primitives/checkbox/Checkbox";
import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { ConstantIcon } from "@/components/icons/distributions/ConstantIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { type ConstantData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function ConstantDistribution({ data }: { data: ConstantData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">{formatNumber(data.value)}</Heading>
      <ConstantIcon label="Constant" size="xl" className="text-neutral-10" />
    </div>
  );
}

export function ConstantDistributionPreview({ data }: { data: ConstantData }) {
  return (
    <>
      <ConstantIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="sm">Constant Value</Heading>
    </>
  );
}

export function ConstantDistributionProperties({
  data,
  onChange,
}: {
  data: ConstantData;
  onChange: (nextData: ConstantData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading size="xs">Value</Heading>
      <SheetEditableInput
        data={data}
        onChange={onChange}
        flagKey="sheetEditable"
      >
        <NumberInput
          value={data.value}
          onChange={(value) =>
            onChange({
              ...data,
              value,
            })
          }
        />
      </SheetEditableInput>
    </div>
  );
}
