import React from "react";

import { InformationIcon } from "@/icons/svgs/Information";
import { cn } from "@/utils/tailwind";

import { Tooltip } from "../floating/tooltip/Tooltip";
import { Separator } from "../separator/Separator";
import { type TextProps, Txt } from "../text/Text";

export type MoneyValueProps = TextProps & {
  amount: number;
  parts?: {
    name: string;
    amount: number;
  }[];

  /**
   * @default false
   */
  abbreviate?: boolean;

  /**
   * @default false
   */
  isRelativeChange?: boolean;

  /**
   * @default false
   */
  highlightNegative?: boolean;
};

export function toMoneyString({
  amount,
  isRelativeChange,
  abbreviate,
}: Pick<
  MoneyValueProps,
  "amount" | "isRelativeChange" | "abbreviate"
>): string {
  return Intl.NumberFormat("en-US", {
    style: isRelativeChange ? "decimal" : "currency",
    currency: "USD",
    currencySign: "standard",
    notation: abbreviate ? "compact" : "standard",
    minimumSignificantDigits: abbreviate && amount >= 100000 ? 3 : undefined,
    maximumSignificantDigits: abbreviate && amount >= 100000 ? 3 : undefined,
    minimumFractionDigits: abbreviate && amount >= 100000 ? undefined : 2,
    maximumFractionDigits: abbreviate && amount >= 100000 ? undefined : 2,
    signDisplay: isRelativeChange ? "exceptZero" : "auto",
  }).format(amount / 100);
}

export const MoneyValue = React.forwardRef<
  HTMLParagraphElement,
  MoneyValueProps
>((props: MoneyValueProps, ref) => {
  const {
    amount,
    parts,
    abbreviate = false,
    isRelativeChange = false,
    highlightNegative = false,
    className,
    ...rest
  } = props;

  const hasCalc =
    parts !== undefined &&
    parts.length > 1 &&
    parts.filter((part) => part.amount !== 0).length > 0;

  const value = toMoneyString({ amount, isRelativeChange, abbreviate });

  return (
    <Txt
      ref={ref}
      as="span"
      {...rest}
      className={cn(
        "font-mono",
        "font-semibold",
        "inline",
        {
          "text-danger-12": highlightNegative && amount < 0,
        },
        className
      )}
    >
      {hasCalc && (
        <Tooltip
          content={
            <>
              {parts
                .filter((part, idx) => idx === 0 || part.amount !== 0)
                .map((part, idx) => (
                  <div
                    key={`${part.name}-${idx}`}
                    className="flex justify-between gap-comfortable"
                  >
                    <Txt intent="subtle">{part.name}</Txt>
                    <MoneyValue
                      amount={part.amount}
                      isRelativeChange
                      highlightNegative
                    />
                  </div>
                ))}
              <Separator />
              <div className="flex justify-between">
                <Txt>=</Txt>
                <MoneyValue amount={amount} />
              </div>
            </>
          }
        >
          <InformationIcon
            label="more info"
            className="inline text-neutral-10"
            size="sm"
          />
        </Tooltip>
      )}
      {value}
    </Txt>
  );
});

MoneyValue.displayName = "MoneyValue";
