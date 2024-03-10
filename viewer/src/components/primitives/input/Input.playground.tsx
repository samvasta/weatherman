import React from "react";

import type { PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Heading } from "../text/Heading";
import {
  Input as InputComponent,
  type InputProps,
  type InputVariants,
} from "./Input";

export const InputMeta: PlaygroundComponent<InputProps> = {
  name: "Input",
  defaultProps: {
    placeholder: "Placeholder",
  },
  Preview: InputComponent,
  variants: [
    {
      name: "Outline",
      props: {
        variant: "outline",
      },
    },
    {
      name: "Inline",
      props: {
        variant: "inline",
      },
    },
    {
      name: "Flushed",
      props: {
        variant: "flushed",
      },
    },
  ],
  Component: (args: Pick<InputProps, "size" | "variant">) => {
    const sizes = ["xs", "sm", "md", "lg"] satisfies InputVariants["size"][];

    return (
      <div className="flex flex-col gap-regular">
        <div className="gap-compact flex items-start justify-start">
          {sizes.map((size) => (
            <InputComponent
              key={`regular-${size}`}
              {...args}
              size={size}
              placeholder={`Placeholder (size: ${size})`}
            />
          ))}
        </div>

        <Heading size="md">Invalid</Heading>
        <div className="gap-compact flex items-start justify-start">
          {sizes.map((size) => (
            <InputComponent
              key={`invalid-${size}`}
              {...args}
              size={size}
              aria-invalid={true}
              required
              placeholder={`Placeholder (size: ${size})`}
            />
          ))}
        </div>

        <Heading size="md">Disabled</Heading>
        <div className="gap-compact flex items-start justify-start">
          {sizes.map((size) => (
            <InputComponent
              key={`disabled-${size}`}
              {...args}
              size={size}
              disabled
              placeholder={`Placeholder (size: ${size})`}
            />
          ))}
        </div>
      </div>
    );
  },
};
