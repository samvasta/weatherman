import React from "react";

import { type useFloatCombo } from "./useFloatCombo";

type ComboContextType =
  | (ReturnType<typeof useFloatCombo> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

export const FloatComboContext = React.createContext<ComboContextType>(null);

export const useFloatComboState = () => {
  const context = React.useContext(FloatComboContext);

  if (context == null) {
    throw new Error("Float components must be wrapped in <Float />");
  }

  return context;
};
