import * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/utils/tailwind";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-dropdown overflow-hidden border bg-neutral-1 text-neutral-12 shadow-md animate-in fade-in-80",
        "border-2 border-t-0 border-neutral-12",
        "radix-state-open:shadow-[inset_4px_0px_0px_theme(colors.primary.9)]",
        className
      )}
      position={position}
      sideOffset={-2}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-0 outline-none ring-0",

          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-popper-anchor-width)-4px)] max-w-[calc(var(--radix-popper-anchor-width)-4px)]"
        )}
      >
        <div className={cn("ml-1 flex flex-col border-t-2 border-t-neutral-6")}>
          {children}
        </div>
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export { SelectContent };
