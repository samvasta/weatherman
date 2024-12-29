import { z } from "zod";

import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { UniformIcon } from "@/components/icons/distributions/UniformIcon";
import { SheetEditableInput } from "@/components/sheet-editable-input/SheetEditableInput";

import { formatNumber } from "@/utils/numberFormat";

import {
  CommonDistributionInfoData,
  DistributionInfo,
  DistributionType,
} from "../common";

const UniformSchema = z
  .object({
    type: z.literal(DistributionType.Uniform),
    min: z.number().finite(),
    max: z.number().finite(),
    minSheetEditable: z.boolean(),
    maxSheetEditable: z.boolean(),
  })
  .superRefine(({ min, max }, ctx) => {
    if (min > max) {
      ctx.addIssue({
        code: "too_big",
        maximum: max,
        type: "number",
        path: ["min"],
        message: "The minimum value cannot be greater than the maximum value",
        inclusive: true,
      });
    }
  });

type UniformData = z.infer<typeof UniformSchema>;
function isUniform(
  distribution: CommonDistributionInfoData
): distribution is UniformData {
  return distribution.type === DistributionType.Uniform;
}
function UniformDistribution({ data }: { data: UniformData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {formatNumber(data.min)} - {formatNumber(data.max)}
      </Heading>
      <UniformIcon label="Uniform" size="xl" className="text-neutral-10" />
    </div>
  );
}

function UniformDistributionPreview({ data }: { data: UniformData }) {
  return (
    <>
      <UniformIcon label="Uniform" size="xl" className="text-neutral-10" />
      <Heading size="sm">Random Value</Heading>
    </>
  );
}

function UniformDistributionProperties({
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

export const UniformInfo: DistributionInfo<UniformData> = {
  checkType: isUniform,
  defaultConfig: {
    type: DistributionType.Uniform,
    min: 0,
    max: 10,

    minSheetEditable: true,
    maxSheetEditable: true,
  },
  DistributionNodeContent: UniformDistribution,
  DistributionPreviewContent: UniformDistributionPreview,
  DistributionProperties: UniformDistributionProperties,
  schema: UniformSchema,
};
