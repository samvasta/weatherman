import React, { useMemo } from "react";

import { type VariantProps, cva } from "class-variance-authority";
import {
  differenceInDays,
  format as formatDate,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

import { formatRelativeWithoutTime } from "@/utils/dates";
import { cn } from "@/utils/tailwind";

export const DATE_FORMAT_DEFAULT = "MMMM do, yyyy";
export const DATE_FORMAT_LONG = "eeee, MMMM do, yyyy";
export const DATE_FORMAT_SHORT = "MMM. dd";

const INVALID = "(invalid date)";

export const dateStringClassNames = cva("font-mono", {
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
      xs: "text-xs font-medium",
      sm: "text-sm font-medium",
      md: "text-base font-medium",
      lg: "text-lg font-semibold",
      xl: "text-xl font-bold",
      "2xl": "text-xl font-black",
      inherit: "",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "inherit",
    context: "paragraph",
  },
});

export const DateFormat = {
  default: (date) => formatDate(date, DATE_FORMAT_DEFAULT),
  long: (date) => formatDate(date, DATE_FORMAT_LONG),
  short: (date) => formatDate(date, DATE_FORMAT_SHORT),
} satisfies { [key: string]: (date: Date) => string };

export type DateStringProps = React.HTMLAttributes<HTMLElement> & {
  as?: Extract<keyof JSX.IntrinsicElements, "p" | "span" | "div">;
} & VariantProps<typeof dateStringClassNames> & {
    date: Date | string;
    format: keyof typeof DateFormat;
    relative?: "always" | "never" | "recent";
  };

export const DateString = React.forwardRef<HTMLElement, DateStringProps>(
  (props, ref) => {
    const {
      date,
      size,
      intent,
      className,
      as,
      format,
      relative = "never",
      ...rest
    } = props;

    const Element = as || "p";

    const dateStr = useMemo(() => {
      const dateValue = typeof date === "string" ? parseISO(date) : date;
      if (!isValid(dateValue)) {
        return INVALID;
      }

      if (
        relative === "always" ||
        (relative === "recent" &&
          differenceInDays(startOfDay(dateValue), startOfDay(Date.now())) <= 7)
      ) {
        return formatRelativeWithoutTime(dateValue);
      }
      return DateFormat[format](dateValue);
    }, [date, format, relative]);

    return (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.LegacyRef<any>}
        className={cn(dateStringClassNames({ size, intent, className }), {
          "text-neutral-10": dateStr === INVALID,
        })}
        {...rest}
      >
        {dateStr}
      </Element>
    );
  }
);

DateString.displayName = "DateString";
