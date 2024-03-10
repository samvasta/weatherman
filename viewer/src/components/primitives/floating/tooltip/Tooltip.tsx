import React from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type VariantProps, cva } from "class-variance-authority";

import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/utils/tailwind";

import { Dialog } from "../dialog/Dialog";
import { TooltipArrow } from "./TooltipArrow";

const tooltip = cva("font-sans font-medium", {
  variants: {
    colorScheme: {
      default: "border-info-10",
      primary: "border-primary-10",
      secondary: "border-secondary-10",
      tertiary: "border-tertiary-10",
      success: "border-success-10",
      danger: "border-danger-10",
      info: "border-info-10",
      neutral: "border-neutral-10",
    },
  },
  defaultVariants: {
    colorScheme: "default",
  },
});

export type TooltipProps = React.PropsWithChildren<
  VariantProps<typeof tooltip> & {
    content: React.ReactNode;
    side?: TooltipPrimitive.TooltipContentProps["side"];
  } & TooltipPrimitive.TooltipProviderProps
>;

export function Tooltip(props: TooltipProps) {
  const {
    children,
    content,
    colorScheme,
    side = "top",
    ...providerProps
  } = props;

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog
        content={content}
        triggerProps={{ asChild: true }}
        showCloseButton={false}
      >
        {children}
      </Dialog>
    );
  }

  return (
    <TooltipPrimitive.Provider {...providerProps}>
      <TooltipPrimitive.Root delayDuration={providerProps.delayDuration || 250}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className={cn(
              tooltip({ colorScheme }),
              "bg-neutral-1 p-3 text-neutral-12",
              "shadow-lg",
              "max-w-md",
              // Border depends on placement of tooltip
              "z-tooltip radix-side-bottom:border-t-4 radix-side-left:border-r-4 radix-side-right:border-l-4 radix-side-top:border-b-4"
            )}
            data-bg-inverted={"true"}
          >
            {content}
            <TooltipArrow colorScheme={colorScheme} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
