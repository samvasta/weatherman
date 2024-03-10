import React from "react";

import { useMergeRefs } from "@floating-ui/react";

import { useFloatComboState } from "./FloatComboContext";

interface FloatComboTriggerProps {
  children: React.ReactNode;
}

export const FloatComboTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & FloatComboTriggerProps
>(function FloatComboTrigger({ children, ...props }, propRef) {
  const state = useFloatComboState();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const childrenRef = (children as any).ref;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const ref = useMergeRefs([state.refs.setReference, propRef, childrenRef]);

  return React.cloneElement(
    children as React.ReactElement,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    state.getReferenceProps({
      ref,
      ...props,
      ...(children as React.ReactElement).props,
      "data-state": state.open ? "open" : "closed",
      onClick: (e) => {
        if (state.mode === "tooltip") {
          state.openModal();
        } else {
          if (props.onClick) {
            props.onClick(e as React.MouseEvent<HTMLElement, MouseEvent>);
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if ((children as React.ReactElement).props.onClick) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            (children as React.ReactElement).props.onClick(e);
          }
        }
      },
    })
  );
});
