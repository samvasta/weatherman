import * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";
import { CheckIcon } from "lucide-react";

export const checkboxVariants = cva(
  "border-cur-scheme-12 focus-visible:ring-ring data-[state=checked]:bg-cur-scheme-9 data-[state=checked]:border-cur-scheme-9 data-[state=checked]:text-neutral-12 peer h-6 w-6 shrink-0 border focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-neutral-3 disabled:text-neutral-10 disabled:border-neutral-6",
  {
    variants: {
      size: {
        sm: "p-0",
        md: "p-0",
        lg: "p-0",
      },
      colorScheme: {
        neutral: "scheme-neutral text-neutral-12",
        primary: "scheme-primary",
        secondary: "scheme-secondary",
        tertiary: "scheme-tertiary",
        danger: "scheme-danger",
        success: "scheme-success",
        info: "scheme-info",
        inherit: "",
      },
    },
    defaultVariants: {
      colorScheme: "inherit",
      size: "md",
    },
  }
);

export const checkboxSizeToIndicatorSize = {
  lg: "w-6 h-6",
  md: "w-4 h-4",
  sm: "w-3 h-3",
} as const;

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    CheckboxVariants
>(({ className, colorScheme, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ colorScheme, size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center leading-none")}
    >
      <CheckIcon className={checkboxSizeToIndicatorSize[size || "md"]} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    CheckboxVariants
>(({ children, ...props }, ref) => (
  <div className="inline-flex items-center gap-tight">
    <Checkbox {...props} ref={ref} />
    <label htmlFor={props.id}>{children}</label>
  </div>
));
CheckboxWithLabel.displayName = "CheckboxWithLabel";
