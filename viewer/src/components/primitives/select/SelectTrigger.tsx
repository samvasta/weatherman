import * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { type createIcon } from "@/icons/createIcon";
import { CaretDownIcon } from "@/icons/svgs/CaretDown";
import { cn } from "@/utils/tailwind";

export type SelectTriggerProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> & {
  icon?: ReturnType<typeof createIcon>;
};

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    { className, icon: IconComponent = CaretDownIcon, children, ...props },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-fit w-full items-center justify-between gap-2 border-2 border-neutral-12 bg-neutral-1 px-3 py-0.5 text-sm ring-neutral-12 radix-placeholder:text-neutral-11",
        "focus:outline-none radix-state-open:shadow-[inset_4px_0px_0px_theme(colors.primary.9)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "leading-5",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconComponent
          label="toggle"
          className="h-6 w-6 min-w-[1.5rem] text-neutral-12"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export { SelectTrigger };
