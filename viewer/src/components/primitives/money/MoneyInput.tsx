import React from "react";

import { CalculatorIcon } from "@/icons/svgs/Calculator";
import { CheckIcon } from "@/icons/svgs/Check";
import { cn } from "@/utils/tailwind";

import { Button } from "../button/Button";
import { Collapsible, CollapsibleContent } from "../collapsible/Collapsible";
import { Input, type InputProps } from "../input/Input";
import { MoneyValue } from "./MoneyValue";
import { parseExpression } from "./parser";

export type MoneyInputProps = Omit<
  InputProps,
  "value" | "onSubmit" | "onChange"
> & {
  amount: number;
  onChange: (amount: number) => void;
};

function truncateFractionalCents(amount: number) {
  return Math.round(Math.trunc(amount * 100) / 100);
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (props: MoneyInputProps, ref) => {
    const { amount, onChange: onChangeProp, className, ...inputProps } = props;
    const [isCalc, setCalc] = React.useState(false);

    const [currentInputStr, setCurrentInputStr] = React.useState(
      (amount / 100).toFixed(2)
    );
    const [calcStr, setCalcStr] = React.useState(
      "=" + (amount / 100).toFixed(2)
    );

    const currentParsedValue = React.useMemo(() => {
      try {
        return parseExpression(calcStr.replace("=", "")) * 100;
      } catch (_) {
        return Number.NaN;
      }
    }, [calcStr]);

    React.useEffect(() => {
      setCurrentInputStr((amount / 100).toFixed(2));
      setCalcStr((prev) => {
        const current = parseExpression(prev.replace("=", "")) * 100;
        if (
          truncateFractionalCents(current) !== truncateFractionalCents(amount)
        ) {
          return "=" + (amount / 100).toFixed(2);
        }
        return prev;
      });
    }, [amount]);

    const onChange = (inputStr: string) => {
      const value = Number.parseFloat(inputStr.replace(".", ""));
      if (Number.isFinite(value)) {
        onChangeProp(value);
        setCurrentInputStr((value / 100).toFixed(2));
        setCalcStr("=" + (value / 100).toFixed(2));
      }
    };

    const onChangeCalc = (inputStr: string) => {
      if (!inputStr.startsWith("=")) {
        setCalc(false);
        setCalcStr("=");
      } else {
        setCalcStr(inputStr);
      }
    };

    React.useEffect(() => {
      if (
        Number.isFinite(currentParsedValue) &&
        currentParsedValue !== amount &&
        isCalc
      ) {
        onChangeProp(truncateFractionalCents(currentParsedValue));
      }
    }, [currentParsedValue, onChangeProp, amount, isCalc]);

    const controlButtons = React.useMemo(() => {
      return (
        <div className="flex gap-xtight px-0">
          <Button
            aria-label="cancel"
            onClick={() => {
              setCalc(!isCalc);
            }}
            className="h-full p-0"
            size="md"
            tabIndex={-1}
            variant="ghost"
          >
            {isCalc ? (
              <CheckIcon size="md" label="Done" />
            ) : (
              <CalculatorIcon size="md" label="cancel" />
            )}
          </Button>
        </div>
      );
    }, [setCalc, isCalc]);

    return (
      <Collapsible
        className={cn(
          "relative h-fit border-neutral-12 bg-neutral-3 font-mono",
          {
            "font-semibold": isCalc,
            bold: !isCalc,
            border: inputProps.variant === "outline" || !inputProps.variant,
          },
          "h-full",
          className
        )}
        open={isCalc}
        ref={ref}
      >
        {isCalc ? (
          <div className="flex h-8 w-full items-center justify-end border-l-4 border-primary-9 pr-regular">
            <MoneyValue amount={currentParsedValue} />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-1/2 ml-2 w-auto -translate-y-1/2">
              {controlButtons}
            </div>

            <Input
              {...inputProps}
              variant={inputProps.variant === "flushed" ? "flushed" : "inline"}
              value={currentInputStr}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              onFocus={(e) => {
                e.currentTarget.select();
              }}
              className={"pl-16 pr-4 text-end"}
              autoFocus={inputProps.autoFocus}
              onKeyDownCapture={(e) => {
                if (!isCalc && (e.code === "Equal" || e.code === "Comma")) {
                  setCalc(true);
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
              inputMode={"text"}
            />
          </div>
        )}
        <CollapsibleContent
          className="absolute left-[-2px] z-dropdown box-content
           w-full border border-t-0"
        >
          <div>
            <Input
              variant="inline"
              {...inputProps}
              value={calcStr}
              onChange={(e) => {
                onChangeCalc(e.target.value);
              }}
              onFocus={(e) => {
                e.currentTarget.selectionStart = 1;
                e.currentTarget.selectionEnd = calcStr.length + 1;
              }}
              onBlur={(_e) => {
                setCalc(false);
              }}
              className={"pl-4 pr-16 text-start"}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.code === "Escape") {
                  setCalc(false);
                  e.stopPropagation();
                }
              }}
              inputMode={"numeric"}
            />
            <div className="absolute right-0 top-1/2 mr-2 w-auto -translate-y-1/2">
              {controlButtons}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
MoneyInput.displayName = "MoneyInput";
