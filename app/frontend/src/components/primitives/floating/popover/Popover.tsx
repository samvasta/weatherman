import React from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";
import { wrapIf } from "@/utils/wrapIf";

import { Dialog } from "../dialog/Dialog";
import { blockDismissEvents } from "../event-handlers";
import { PopoverArrow } from "./PopoverArrow";
import { XIcon } from "lucide-react";

export const popoverVariants = cva("font-sans font-medium", {
  variants: {
    colorScheme: {
      neutral: "border-neutral-12",
      primary: "border-primary-10",
      secondary: "border-secondary-10",
      tertiary: "border-tertiary-10",
      success: "border-success-10",
      danger: "border-danger-10",
      info: "border-info-10",
    },
  },
  defaultVariants: {
    colorScheme: "neutral",
  },
});

export type PopoverProps = VariantProps<typeof popoverVariants> & {
  content:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  explicitClose?: boolean;
  contentProps?: PopoverPrimitive.PopoverContentProps;
  triggerProps?: PopoverPrimitive.PopoverTriggerProps;
  usePortal?: boolean;
};

const Popover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.PropsWithChildren<PopoverProps>
>(
  (
    {
      children,
      colorScheme,
      content,
      contentProps,
      triggerProps,
      explicitClose,
      usePortal = true,
    },
    ref
  ) => {
    const {
      className: contentClassName,
      align = "center",
      sideOffset = 4,
      ...restOfContentProps
    } = contentProps || {};

    const [open, setOpen] = React.useState(false);

    const finalContent = React.useMemo(() => {
      if (typeof content === "function") {
        return content({ onClose: () => setOpen(false) });
      }
      return content;
    }, [content, setOpen]);

    return (
      <PopoverPrimitive.Popover modal open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger {...triggerProps}>
          {children}
        </PopoverPrimitive.Trigger>
        {wrapIf(
          PopoverPrimitive.Portal,
          {},
          <PopoverPrimitive.Content
            ref={ref}
            className={cn(
              popoverVariants({ colorScheme }),
              "bg-neutral-1 text-neutral-12",
              "outline-none",
              "w-72 p-6",
              "shadow-md",
              "z-popover",
              "animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              // Border depends on placement of tooltip
              "radix-side-bottom:border-t-4 radix-side-left:border-r-4 radix-side-right:border-l-4 radix-side-top:border-b-4",
              contentClassName
            )}
            {...(explicitClose ? blockDismissEvents : {})}
            {...restOfContentProps}
            align={align}
            sideOffset={sideOffset}
          >
            <PopoverArrow colorScheme={colorScheme} />
            {explicitClose && (
              <PopoverPrimitive.Close className="data-[state=open]:bg-accent absolute right-2 top-2 flex h-6 w-6  items-center justify-center hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:text-neutral-11">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </PopoverPrimitive.Close>
            )}
            {finalContent}
          </PopoverPrimitive.Content>,
          usePortal
        )}
      </PopoverPrimitive.Popover>
    );
  }
);

Popover.displayName = PopoverPrimitive.Content.displayName;

export { Popover };
