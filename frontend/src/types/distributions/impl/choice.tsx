import React from "react";

import { MinusIcon, PlusIcon } from "lucide-react";
import { z } from "zod";

import { Button, IconButton } from "@/components/primitives/button/Button";
import { NumberInput } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { ChoiceIcon } from "@/components/icons/distributions/ChoiceIcon";

import { formatNumber } from "@/utils/numberFormat";

import {
  CommonDistributionInfoData,
  DistributionInfo,
  DistributionType,
} from "../common";

const ChoiceSchema = z.object({
  type: z.literal(DistributionType.Choice),
  options: z
    .array(
      z.object({
        value: z.number().finite(),
        weight: z.number().finite().positive("Weight must be positive."),

        valueSheetEditable: z.boolean(),
        weightSheetEditable: z.boolean(),
      })
    )
    .min(1),
});

type ChoiceData = z.infer<typeof ChoiceSchema>;
function isChoice(
  distribution: CommonDistributionInfoData
): distribution is ChoiceData {
  return distribution.type === DistributionType.Choice;
}

function ChoiceDistribution({ data }: { data: ChoiceData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.options.map((opt) => formatNumber(opt.value)).join(", ")}
      </Heading>
      <ChoiceIcon label="Choice" size="xl" className="text-neutral-10" />
    </div>
  );
}

function ChoiceDistributionPreview({ data }: { data: ChoiceData }) {
  return (
    <>
      <ChoiceIcon label="Normal" size="xl" className="text-neutral-10" />
      <Heading size="sm">Spin the wheel</Heading>
    </>
  );
}

function ChoiceDistributionProperties({
  data,
  onChange,
}: {
  data: ChoiceData;
  onChange: (nextData: ChoiceData) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading>Choices</Heading>

      <div className="grid grid-cols-[auto_auto_auto] gap-1">
        <Heading size="xs">Value</Heading>
        <Heading size="xs">Weight</Heading>
        <div></div>

        {data.options.map((opt, i) => (
          <React.Fragment key={`${i}`}>
            <NumberInput
              value={opt.value}
              onChange={(value) =>
                onChange({
                  ...data,
                  options: data.options.map((option, idx) => {
                    if (i === idx) {
                      return {
                        ...option,
                        value,
                      };
                    }
                    return option;
                  }),
                })
              }
            />
            <NumberInput
              value={opt.weight}
              onChange={(value) =>
                onChange({
                  ...data,
                  options: data.options.map((option, idx) => {
                    if (i === idx) {
                      return {
                        ...option,
                        weight: value,
                      };
                    }
                    return option;
                  }),
                })
              }
            />
            <IconButton
              onClick={() => {
                onChange({
                  ...data,
                  options: data.options.filter((_, idx) => i !== idx),
                });
              }}
              variant="ghost"
              colorScheme="danger"
              className="text-neutral-12"
            >
              <MinusIcon />
            </IconButton>
          </React.Fragment>
        ))}
      </div>
      <Button
        variant="ghost"
        colorScheme="primary"
        onClick={() => {
          onChange({
            ...data,
            options: data.options.concat({
              value: 1,
              weight: 1,
              valueSheetEditable: true,
              weightSheetEditable: true,
            }),
          });
        }}
      >
        <PlusIcon />
        Add Option
      </Button>
    </div>
  );
}

export const ChoiceInfo: DistributionInfo<ChoiceData> = {
  checkType: isChoice,
  defaultConfig: {
    type: DistributionType.Choice,
    options: [
      {
        value: 0,
        weight: 1,
        valueSheetEditable: true,
        weightSheetEditable: true,
      },
      {
        value: 1,
        weight: 1,
        valueSheetEditable: true,
        weightSheetEditable: true,
      },
    ],
  },
  DistributionNodeContent: ChoiceDistribution,
  DistributionPreviewContent: ChoiceDistributionPreview,
  DistributionProperties: ChoiceDistributionProperties,
  schema: ChoiceSchema,
};
