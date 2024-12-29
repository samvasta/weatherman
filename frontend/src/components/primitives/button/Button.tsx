import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

export const buttonVariants = cva(
  "inline-flex gap-1 items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 disabled:pointer-events-none h-fit",
  {
    variants: {
      variant: {
        solid: [
          "border border-neutral-12 text-neutral-12 bg-cur-scheme-8",
          "hover:bg-cur-scheme-9",
          "active:ring-1 ring-neutral-12 focus-active:ring-1 active:bg-cur-scheme-10",
        ],
        ghost: [
          "bg-transparent text-cur-scheme-11",
          "hover:bg-cur-scheme-4 hover:text-cur-scheme-12",
          "active:ring-2 active:ring-cur-scheme-8",
        ],
        link: "hover:underline bg-transparent text-cur-scheme-11 hover:text-cur-scheme-12",
      },
      size: {
        xs: "text-xs px-1.5 py-0.5 underline-offset-2",
        sm: "text-sm px-2 py-[3px] underline-offset-2",
        md: "text-md px-3 py-1 underline-offset-4",
        lg: "text-lg px-4 py-1.5 underline-offset-[0.375rem]",
      },
      colorScheme: {
        inverted: "scheme-neutral border-0",
        neutral: "scheme-neutral text-neutral-12",
        primary: "scheme-primary",
        danger: "scheme-danger",
        success: "scheme-success",
        info: "scheme-info",
        inherit: "",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        colorScheme: "neutral",
        className: [
          "bg-cur-scheme-3",
          "hover:bg-cur-scheme-4",
          "active:bg-cur-scheme-5",
        ],
      },
      {
        variant: "solid",
        colorScheme: "inverted",
        className: [
          "bg-cur-scheme-12",
          "hover:bg-neutral-13",
          "active:bg-cur-scheme-11",
          "text-primary-4",
        ],
      },
      {
        variant: "link",
        size: ["xs", "sm"],
        className: "px-0.5",
      },
      {
        variant: "link",
        size: ["md", "lg"],
        className: "px-1",
      },
    ],
    defaultVariants: {
      colorScheme: "inherit",
      size: "md",
      variant: "solid",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  // eslint-disable-next-line @typescript-eslint/ban-types
  ButtonVariants & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      leftIcon,
      rightIcon,
      className,
      colorScheme,
      variant,
      size,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          {
            "pl-1": Boolean(leftIcon),
            "pr-1": Boolean(rightIcon),
          },
          "relative",
          buttonVariants({ variant, size, colorScheme, className }),
        )}
        ref={ref}
        type="button"
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  // eslint-disable-next-line @typescript-eslint/ban-types
  ButtonVariants & {};
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, colorScheme, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, colorScheme }),
          "p-1",
          className
        )}
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
