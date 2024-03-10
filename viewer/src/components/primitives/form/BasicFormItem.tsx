import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/utils/tailwind";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  type FormMessageProps,
} from "./Form";

export function BasicFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  render,
  customMessage,
  className,
  ...props
}: ControllerProps<TFieldValues, TName> &
  Pick<FormMessageProps, "customMessage"> &
  Pick<React.HTMLAttributes<HTMLElement>, "className">) {
  return (
    <FormField
      {...props}
      render={(ctx) => (
        <FormItem className={cn("h-full w-full", className)}>
          <FormControl>{render(ctx)}</FormControl>
          <FormMessage customMessage={customMessage} />
        </FormItem>
      )}
    ></FormField>
  );
}

export function UncontrolledBasicFormField({
  children,
  customMessage,
  className,
}: React.PropsWithChildren<
  Pick<FormMessageProps, "customMessage"> &
    Pick<React.HTMLAttributes<HTMLElement>, "className">
>) {
  return (
    <>
      <div className={cn("h-full w-full", className)}>
        {children}
        <FormMessage customMessage={customMessage} />
      </div>
    </>
  );
}
