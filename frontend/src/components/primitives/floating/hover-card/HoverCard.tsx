import React from "react";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

import { popoverVariants } from "../popover/Popover";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> &
    VariantProps<typeof popoverVariants>
>(
  (
    { colorScheme, className, align = "center", sideOffset = 4, ...props },
    ref
  ) => (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        popoverVariants({ colorScheme }),
        "bg-neutral-1 text-neutral-12",
        "outline-none",
        "w-72 p-6",
        "shadow-md",
        "z-popover",
        // Border depends on placement of tooltip
        "radix-side-bottom:border-t-4 radix-side-left:border-r-4 radix-side-right:border-l-4 radix-side-top:border-b-4",
        className
      )}
      {...props}
    />
  )
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
