import React from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button, IconButton } from "@/components/primitives/button/Button";
import { Input } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

import { ChoiceIcon } from "@/components/icons/distributions/ChoiceIcon";

import { type ChoiceData } from "@/types/distributions";
import { formatNumber } from "@/utils/numberFormat";

export function ChoiceDistribution({ data }: { data: ChoiceData }) {
  return (
    <div className="flex items-end gap-2">
      <Heading size="2xl">
        {data.options.map((opt) => formatNumber(opt.value)).join(", ")}
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

export function ChoiceDistributionProperties({
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
            <Input
              value={opt.value}
              type="number"
              onChange={(e) =>
                onChange({
                  ...data,
                  options: data.options.map((option, idx) => {
                    if (i === idx) {
                      return {
                        ...option,
                        value: Number(e.target.value),
                      };
                    }
                    return option;
                  }),
                })
              }
            />
            <Input
              value={opt.weight}
              type="number"
              onChange={(e) =>
                onChange({
                  ...data,
                  options: data.options.map((option, idx) => {
                    if (i === idx) {
                      return {
                        ...option,
                        weight: Number(e.target.value),
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
            options: data.options.concat({ value: 1, weight: 1 }),
          });
        }}
      >
        <PlusIcon />
        Add Option
      </Button>
    </div>
  );
}
