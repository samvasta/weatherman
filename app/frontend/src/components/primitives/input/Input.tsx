import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

export const inputVariants = cva(
  "flex w-full bg-neutral-1 text-neutral-12 disabled:cursor-not-allowed focus:rounded-none active:rounded-none focus-visible:rounded-none enabled:rounded-none outline-none disabled:border-neutral-11 disabled:text-neutral-11 disabled:bg-bAlpha-3 box-border placeholder:overflow-visible",
  {
    variants: {
      variant: {
        outline: [
          "border-2 border-neutral-12 focus:rounded-none box-border",
          "hover:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.6)]",
          "focus:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)] active:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)] focus-visible:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)]",
          "read-only:shadow-none read-only:hover:shadow-none",
          "aria-invalid:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:hover:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:focus:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:focus-active:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)]",
          "disabled:hover:shadow-none",
        ],
        flushed: [
          "border-b-2 border-neutral-12",
          "active:border-primary-9 focus:border-primary-9 focus-active:border-primary-9 active:bg-neutral-3 focus:bg-neutral-3 focus-active:bg-neutral-3",
          "hover:bg-neutral-2",
          "hover:aria-invalid:bg-danger-2",
          "aria-invalid:border-danger-9 aria-invalid:focus:border-danger-9 aria-invalid:focus-active:border-danger-9 aria-invalid:active:border-danger-9 aria-invalid:focus:bg-danger-3 aria-invalid:active:bg-danger-3 aria-invalid:focus-active:bg-danger-3",
        ],
        inline: [
          // borders
          "hover:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.6)]",
          "focus:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)] active:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)] focus-visible:shadow-[inset_6px_0px_0px_-2px_theme(colors.primary.9)]",
          "read-only:shadow-none read-only:hover:shadow-none",
          "aria-invalid:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:hover:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:focus:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)] aria-invalid:focus-active:shadow-[inset_6px_0px_0px_-2px_theme(colors.danger.9)]",
          "disabled:hover:shadow-none",

          // hover
          "hover:bg-neutral-2 hover:border-primary-6",
          "hover:aria-invalid:bg-danger-2 hover:aria-invalid:border-danger-6",

          // active/focus
          "active:bg-neutral-3 focus:bg-neutral-3 focus-active:bg-neutral-3",
          "active:aria-invalid:bg-danger-3 focus:aria-invalid:bg-danger-3 focus-active:aria-invalid:bg-danger-3",

          // hover & active/focus
          "hover:active:border-primary-9 hover:focus:border-primary-9 hover:focus-active:border-primary-9 ",
          "hover:active:aria-invalid:border-danger-9 hover:focus:aria-invalid:border-danger-9 hover:focus-active:aria-invalid:border-danger-9 ",
        ],
      },
      size: {
        xs: "text-xs px-1.5 py-0.5",
        sm: "text-sm px-2 py-[3px]",
        md: "text-md px-3 py-1",
        lg: "text-lg px-4 py-1.5",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "outline",
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  Partial<InputVariants> & {
    charSize?: React.InputHTMLAttributes<HTMLInputElement>["size"];
  };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size = "md", variant = "outline", type, charSize, ...props },
    ref
  ) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant }), className)}
        ref={ref}
        size={charSize}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  InputVariants;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          inputVariants({ size, variant }),
          "min-h-[60px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
