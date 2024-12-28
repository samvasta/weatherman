import { type DismissableLayerProps } from "@radix-ui/react-dismissable-layer";

const blockOnEscapeKeyDown: DismissableLayerProps["onEscapeKeyDown"] = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const blockOnPointerDownOutside: DismissableLayerProps["onPointerDownOutside"] =
  (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

const blockOnFocusOutside: DismissableLayerProps["onFocusOutside"] = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const blockOnInteractOutside: DismissableLayerProps["onInteractOutside"] = (
  e
) => {
  e.preventDefault();
  e.stopPropagation();
};

export const blockDismissEvents: DismissableLayerProps = {
  onEscapeKeyDown: blockOnEscapeKeyDown,
  onPointerDownOutside: blockOnPointerDownOutside,
  onFocusOutside: blockOnFocusOutside,
  onInteractOutside: blockOnInteractOutside,
};
