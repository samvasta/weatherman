import * as React from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

export const arrow = cva("fill-current", {
  variants: {
    colorScheme: {
      default: "text-neutral-10",
      primary: "text-primary-10",
      success: "text-success-10",
      danger: "text-danger-10",
      neutral: "text-neutral-12",
    },
  },
  defaultVariants: {
    colorScheme: "neutral",
  },
});
export function PopoverArrow({ colorScheme }: VariantProps<typeof arrow>) {
  return (
    <PopoverPrimitive.Arrow
      className={cn(arrow({ colorScheme: colorScheme }))}
    />
  );
}
