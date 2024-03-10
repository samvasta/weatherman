import React from "react";

import { Heading } from "@/components/primitives/text/Heading";

import type { PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { PiggyBankIcon } from "@/icons/svgs/PiggyBank";

import { Button, type ButtonProps, type ButtonVariants } from "./Button";

const colorSchemes: ButtonVariants["colorScheme"][] = [
  "neutral",
  "primary",
  "secondary",
  "tertiary",
  "success",
  "info",
  "danger",
];

const sizes: ButtonVariants["size"][] = ["xs", "sm", "md", "lg"];

export const ButtonMeta: PlaygroundComponent<ButtonProps> = {
  name: "Button",
  Preview: Button,
  Component: ({ variant }) => {
    return (
      <div className="gap-compact flex flex-col text-neutral-12">
        {colorSchemes
          .filter((c) => c !== null && c !== undefined)
          .map((colorScheme: ButtonVariants["colorScheme"]) => (
            <div key={colorScheme}>
              <Heading size="lg">{colorScheme}</Heading>
              <div className="mt-regular flex gap-regular">
                {sizes.map((size) => (
                  <Button
                    key={`${colorScheme || "unset"}-${size || "unset"}`}
                    size={size}
                    colorScheme={colorScheme}
                    variant={variant}
                  >
                    {size} - {colorScheme}
                  </Button>
                ))}
              </div>
            </div>
          ))}

        <Heading size="lg">With Icons</Heading>
        <div className="mt-regular flex gap-regular">
          {colorSchemes.map((colorScheme) => (
            <Button
              key={colorScheme || "unset"}
              size={"md"}
              colorScheme={colorScheme}
              variant={variant}
            >
              <PiggyBankIcon label="example icon" />
              {colorScheme}
            </Button>
          ))}
        </div>
      </div>
    );
  },
  defaultProps: {
    children: "Button",
  },
  variants: [
    {
      name: "Solid",
      props: { variant: "solid" },
    },
    {
      name: "Ghost",
      props: { variant: "ghost" },
    },
    {
      name: "Link",
      props: { variant: "link" },
    },
  ],
};
