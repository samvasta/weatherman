import React, { type LegacyRef, useMemo } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { ColorSchemeClasses, cn } from "@/utils/tailwind";

import { textClassNames } from "./Text";

export const highlightClassNames = cva("", {
  variants: {
    colorScheme: ColorSchemeClasses,
  },
  defaultVariants: {
    colorScheme: "primary",
  },
});

export type HighlightVariants = VariantProps<typeof highlightClassNames>;

export type HighlightedProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof textClassNames> &
    HighlightVariants & {
      as?: Extract<keyof JSX.IntrinsicElements, "p" | "span" | "div">;
      pattern?: string;
      inheritTextStyle?: boolean;
    }
>;

export const Highlighted = React.forwardRef<HTMLElement, HighlightedProps>(
  (props, ref) => {
    const {
      as,
      children,
      size,
      intent,
      className,
      pattern,
      colorScheme,
      inheritTextStyle = false,
      ...rest
    } = props;

    const parts: React.ReactNode[] = useMemo(() => {
      if (typeof children !== "string" || pattern === undefined) {
        return [children] as React.ReactNode[];
      }

      const p = children.split(new RegExp(`(${pattern})`));

      return p.map((p, idx) => (
        <span
          key={`part-${idx}`}
          className={p === pattern ? "bg-cur-scheme-7" : ""}
        >
          {p}
        </span>
      )) as React.ReactNode[];
    }, [children, pattern]);

    const Element = as || (inheritTextStyle && "span") || "p";

    return (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as LegacyRef<any>}
        className={cn(
          !inheritTextStyle && textClassNames({ size, intent, className }),
          highlightClassNames({ colorScheme }),
          pattern === undefined && "bg-cur-scheme-7"
        )}
        {...rest}
      >
        {pattern !== undefined ? parts : children}
      </Element>
    );
  }
);

Highlighted.displayName = "Text";
