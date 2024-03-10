import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

export const textClassNames = cva("font-sans font-regular", {
  variants: {
    context: {
      paragraph: "",
      ui: "leading-none",
    },
    intent: {
      default: "text-neutral-12",
      subtle: "text-neutral-11",
      disabled: "text-neutral-10",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-xl lg:text-2xl",
      inherit: "",
    },
  },
  defaultVariants: {
    size: "inherit",
    context: "paragraph",
  },
});

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textClassNames> & {
    as?: Extract<keyof JSX.IntrinsicElements, "p" | "span" | "div">;
  };

export const Txt = React.forwardRef<
  HTMLParagraphElement,
  React.PropsWithChildren<TextProps>
>((props, ref) => {
  const { children, size, intent, context, className, as, ...rest } = props;

  const Element = as || "p";

  return (
    <Element
      ref={ref}
      className={cn(textClassNames({ size, intent, className, context }))}
      {...rest}
    >
      {children}
    </Element>
  );
});

Txt.displayName = "Text";
