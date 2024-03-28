import React from "react";

import { FloatComboContext } from "./FloatComboContext";
import { useFloatCombo } from "./useFloatCombo";

export function FloatCombo({
  children,
  tooltipContent,
  ...restOptions
}: {
  tooltipContent: React.ReactNode;
  children?:
    | React.ReactNode
    | ((props: { state: ReturnType<typeof useFloatCombo> }) => React.ReactNode);
} & Parameters<typeof useFloatCombo>[0]) {
  const float = useFloatCombo({
    placement: "top",
    tooltipContent,
    ...restOptions,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const content = React.useMemo(() => {
    if (typeof children === "function") {
      return children({ state: float });
    }
    return children;
  }, [children, float]);

  return (
    <FloatComboContext.Provider value={float}>
      {content}
    </FloatComboContext.Provider>
  );
}
