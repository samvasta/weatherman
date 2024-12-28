import * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/utils/tailwind";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-neutral-4 focus:text-neutral-12",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "radix-highlighted:bg-neutral-4",
      "radix-state-checked:bg-neutral-5",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <div className="flex items-center gap-xtight">{children}</div>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
export { SelectItem };
