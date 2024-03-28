import React from "react";

import {
  FloatingFocusManager,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

import { FloatComboArrow } from "./FloatComboArrow";
import { useFloatComboState } from "./FloatComboContext";

const floatComboVariants = cva(
  "border-0 box-border shadow-md p-regular max-w-lg z-tooltip",
  {
    variants: {
      colorScheme: {
        neutral: "border-neutral-12",
        primary: "border-primary-10",
        secondary: "border-secondary-10",
        tertiary: "border-tertiary-10",
        success: "border-success-10",
        danger: "border-danger-10",
        info: "border-info-10",
      },
      inverted: {
        true: "text-neutral-1 bg-neutral-12",
        false: "bg-neutral-1 text-neutral-12",
      },
      placement: {
        bottom: "border-t-4",
        ["bottom-end"]: "border-t-4",
        ["bottom-start"]: "border-t-4",

        left: "border-r-4",
        ["left-end"]: "border-r-4",
        ["left-start"]: "border-r-4",

        right: "border-l-4",
        ["right-end"]: "border-l-4",
        ["right-start"]: "border-l-4",

        top: "border-b-4",
        ["top-end"]: "border-b-4",
        ["top-start"]: "border-b-4",
      },
    },
    defaultVariants: {
      colorScheme: "neutral",
      inverted: false,
      placement: "top",
    },
  }
);

export type FloatComboVariantsProps = VariantProps<typeof floatComboVariants>;

export const FloatComboContent = React.forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<HTMLDivElement> & {
    lazy?: boolean;
  }
>(function FloatComboContent(props, propRef) {
  const { lazy = true, className, ...htmlProps } = props;

  const state = useFloatComboState();
  const ref = useMergeRefs([state.refs.setFloating, propRef]);

  if (!state.open && lazy) {
    return null;
  }
  return (
    <FloatingPortal>
      {state.open && (
        <FloatingFocusManager context={state.context} modal={state.modal}>
          <div
            ref={ref}
            style={{
              position: state.strategy,
              top: state.y ?? 0,
              left: state.x ?? 0,
              width: "max-content",
              ...props.style,
            }}
            aria-labelledby={state.labelId}
            aria-describedby={state.descriptionId}
            className="z-popover focus-visible:outline-none"
            {...state.getFloatingProps()}
          >
            <FloatComboArrow />
            <div
              className={cn(
                floatComboVariants({
                  inverted: state.inverted,
                  colorScheme: state.accentColor,
                  placement: state.placement,
                }),
                className
              )}
              {...htmlProps}
            >
              {state.mode === "tooltip" ? state.tooltipContent : props.children}
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});
