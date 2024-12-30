import React from "react";

import * as RdxTooltip from "@radix-ui/react-tooltip";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

export const arrow = cva("fill-current", {
  variants: {
    colorScheme: {
      default: "text-primary-10",
      primary: "text-primary-10",
      success: "text-success-10",
      danger: "text-danger-10",
      neutral: "text-neutral-10",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

export function TooltipArrow({ colorScheme }: VariantProps<typeof arrow>) {
  return <RdxTooltip.Arrow className={cn(arrow({ colorScheme }))} />;
}
