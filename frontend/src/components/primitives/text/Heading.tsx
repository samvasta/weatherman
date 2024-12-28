import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const heading = cva("font-sans font-semibold", {
  variants: {
    intent: {
      default: "text-neutral-12",
      subtle: "text-neutral-11",
      disabled: "text-neutral-10",
    },
    size: {
      xs: "text-sm",
      sm: "text-md",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-[1.75rem]",
      "2xl": "text-2xl",
      display3: "font-serif text-3xl font-bold",
      display2: "font-serif text-4xl font-bold",
      display1: "font-serif text-5xl font-bold",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type HeadingProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof heading> & {
    as?: Extract<keyof JSX.IntrinsicElements, "p" | "span" | "div">;
  };

export const Heading = React.forwardRef<
  HTMLParagraphElement,
  React.PropsWithChildren<HeadingProps>
>((props: React.PropsWithChildren<HeadingProps>, ref) => {
  const { children, size, intent, className, as, ...rest } = props;

  const Element = as || "p";

  return (
    <Element
      ref={ref}
      className={cn(heading({ size, intent, className }))}
      {...rest}
    >
      {children}
    </Element>
  );
});

Heading.displayName = "Heading";
