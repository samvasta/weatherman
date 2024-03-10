import React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { CheckIcon } from "@/icons/svgs/Check";
import { cn } from "@/utils/tailwind";

import {
  type CheckboxVariants,
  checkboxSizeToIndicatorSize,
  checkboxVariants,
} from "../checkbox/Checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  type FormMessageProps,
} from "../form/Form";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    CheckboxVariants
>(({ colorScheme, size, className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        checkboxVariants({ colorScheme, size }),
        // "focus-visible:ring-ring aspect-square h-6 w-6 border text-neutral-12 focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn("flex items-center justify-center leading-none")}
      >
        <CheckIcon
          label="check"
          size={checkboxSizeToIndicatorSize[size || "md"]}
        />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export function RadioGroupFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  items,
  className,
  customMessage,
  colorScheme,
  size,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> &
  Pick<FormMessageProps, "customMessage"> &
  Pick<React.HTMLAttributes<HTMLElement>, "className"> &
  CheckboxVariants & {
    items: {
      value: string;
      label: React.ReactNode;
    }[];
  }) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={cn("h-full w-full", className)}>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {items.map((item, idx) => (
                <div
                  key={`${item.value}-${idx}`}
                  className="inline-flex items-center gap-tight"
                >
                  <RadioGroupItem
                    value={item.value}
                    id={`${props.name}-${item.value}`}
                    colorScheme={colorScheme}
                    size={size}
                  />
                  <FormLabel htmlFor={`${props.name}-${item.value}`}>
                    {item.label}
                  </FormLabel>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage customMessage={customMessage} />
        </FormItem>
      )}
    />
  );
}

export { RadioGroup, RadioGroupItem };
