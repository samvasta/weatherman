import React, { type CSSProperties } from "react";

import { type MiddlewareData, type Placement } from "@floating-ui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

import { useFloatComboState } from "./FloatComboContext";

const floatComboArrowVariants = cva("", {
  variants: {
    colorScheme: {
      neutral: "text-neutral-12",
      primary: "text-primary-10",
      secondary: "text-secondary-10",
      tertiary: "text-tertiary-10",
      success: "text-success-10",
      danger: "text-danger-10",
      info: "text-info-10",
    },
  },
  defaultVariants: {
    colorScheme: "neutral",
  },
});

export function getFloatArrowStyle(
  middlewareData: Partial<MiddlewareData>,
  placement: Placement
): CSSProperties {
  const arrow = {
    x: undefined,
    y: undefined,
    ...middlewareData.arrow,
  };

  const style: CSSProperties = {};

  if (arrow.x !== undefined) {
    style.left = `${arrow.x}px`;
    if (placement.startsWith("top")) {
      style.bottom = 0;
      style.transform = "translate(0%, 100%) rotate(180deg)";
    } else {
      style.top = 0;
      style.transform = "translate(0%, -100%)";
    }
  } else if (arrow.y !== undefined) {
    style.top = `${arrow.y}px`;
    if (placement.startsWith("left")) {
      style.transform = "translate(75%, 0%) rotate(90deg)";
      style.right = 0;
    } else {
      style.transform = "translate(-75%, 0%) rotate(-90deg)";
      style.left = 0;
    }
  }
  return style;
}

export const FloatComboArrow = () => {
  const state = useFloatComboState();

  return (
    <div
      ref={state.arrowRef}
      id="root"
      style={{
        position: "absolute",
        ...getFloatArrowStyle(state.middlewareData, state.placement),
      }}
    >
      <svg
        className={cn(
          floatComboArrowVariants({
            colorScheme: state.accentColor,
          }),
          "h-2 w-4"
        )}
        viewBox="0 0 16 8"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 7.99993H15.9999L7.99993 0L0 7.99993Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
