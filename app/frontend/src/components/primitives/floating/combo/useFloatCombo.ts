import React from "react";

import {
  type ElementProps,
  type Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import { type FloatComboVariantsProps } from "./FloatComboContent";

export interface FloatOptions {
  placement?: Placement;

  inverted?: FloatComboVariantsProps["inverted"];
  accentColor?: FloatComboVariantsProps["colorScheme"];
}

export function useFloatCombo({
  placement,
  inverted = false,
  accentColor = "neutral",
  delay,
  tooltipContent,
}: FloatOptions & {
  delay?: number;
  tooltipContent: React.ReactNode;
}) {
  const arrowRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();
  const [mode, setMode] = React.useState<"tooltip" | "modal">("tooltip");
  const { openModal, closeModal } = React.useMemo(
    () => ({
      openModal: () => setMode("modal"),
      closeModal: () => setMode("tooltip"),
    }),
    [setMode]
  );

  const open = uncontrolledOpen;
  const setOpen = setUncontrolledOpen;

  // @ts-expect-error
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const context = data.context;

  const click = useClick(
    {
      ...context,
      onOpenChange: (open) => {
        if (!open) {
          closeModal();
        }
        context.onOpenChange(open);
      },
    },
    {}
  );
  // @ts-expect-error
  const hover = useHover(context, {
    move: false,
    enabled: mode === "tooltip",
    restMs: delay,
    mouseOnly: true,
  });

  const dismiss = useDismiss({
    ...context,
    onOpenChange: (open) => {
      if (!open) {
        closeModal();
      }
      context.onOpenChange(open);
    },
  });
  const role = useRole(context, {
    role: mode === "modal" ? "dialog" : "tooltip",
  });

  const propsList: ElementProps[] = [hover, click, dismiss, role];

  const interactions = useInteractions(propsList);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      modal: mode === "modal",
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      arrowRef,
      accentColor,
      inverted,
      mode,
      openModal,
      closeModal,
      tooltipContent,
    }),
    [
      open,
      setOpen,
      mode,
      openModal,
      closeModal,
      interactions,
      data,
      labelId,
      descriptionId,
      arrowRef,
      accentColor,
      inverted,
      tooltipContent,
    ]
  );
}
