import {
  type DismissableLayerProps,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from "@radix-ui/react-dismissable-layer";

function blockOnEscapeKeyDown(e: KeyboardEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function blockOnPointerDownOutside(e: PointerDownOutsideEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function blockOnFocusOutside(e: FocusOutsideEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function blockOnInteractOutside(
  e: PointerDownOutsideEvent | FocusOutsideEvent
) {
  e.preventDefault();
  e.stopPropagation();
}

export const blockDismissEvents: DismissableLayerProps = {
  onEscapeKeyDown: blockOnEscapeKeyDown,
  onPointerDownOutside: blockOnPointerDownOutside,
  onFocusOutside: blockOnFocusOutside,
  onInteractOutside: blockOnInteractOutside,
};
