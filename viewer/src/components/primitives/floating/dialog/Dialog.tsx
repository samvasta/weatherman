import React, { useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { CloseIcon } from "@/icons/svgs/Close";
import { cn } from "@/utils/tailwind";
import { wrapIf } from "@/utils/wrapIf";

import { blockDismissEvents } from "../event-handlers";

export const DialogRoot = DialogPrimitive.Root;
export const DialogPortal = DialogPrimitive.Portal;

type CommonDialogProps = React.PropsWithChildren<{
  contentProps?: DialogPrimitive.DialogContentProps;
  showCloseButton?: boolean;
  explicitClose?: boolean;
  usePortal?: boolean;
}>;

export type DialogProps = CommonDialogProps & {
  content:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  triggerProps?: DialogPrimitive.PrimitiveButtonProps;
};

export function Dialog(props: DialogProps) {
  const {
    children,
    triggerProps,
    content,
    contentProps,
    showCloseButton = true,
    explicitClose,
    usePortal = true,
  } = props;

  const [open, setOpen] = useState(false);

  const { className: contentClassName, ...restOfContentProps } =
    contentProps || ({} as DialogPrimitive.DialogContentProps);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild {...triggerProps}>
        {children}
      </DialogPrimitive.Trigger>
      {wrapIf(
        DialogPrimitive.Portal,
        {},
        <>
          <DialogOverlay />
          <DialogContent
            className={contentClassName}
            {...(explicitClose ? blockDismissEvents : {})}
            {...restOfContentProps}
          >
            {showCloseButton && <DialogCloseButton />}
            {typeof content === "function"
              ? content({ onClose: () => setOpen(false) })
              : content}
          </DialogContent>
        </>,
        usePortal
      )}
    </DialogPrimitive.Root>
  );
}

export type ControlledDialogProps = CommonDialogProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ControlledDialog(props: ControlledDialogProps) {
  const {
    open,
    setOpen,
    children,
    contentProps,
    showCloseButton = true,
    explicitClose,
    usePortal = true,
  } = props;

  const { className: contentClassName, ...restOfContentProps } =
    contentProps || ({} as DialogPrimitive.DialogContentProps);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {wrapIf(
        DialogPrimitive.Portal,
        {},
        <>
          <DialogOverlay />
          <DialogContent
            className={contentClassName}
            {...(explicitClose ? blockDismissEvents : {})}
            {...restOfContentProps}
          >
            {showCloseButton && <DialogCloseButton />}
            {children}
          </DialogContent>
        </>,
        usePortal
      )}
    </DialogPrimitive.Root>
  );
}

export const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DialogPrimitive.DialogOverlayProps>
>(
  (
    {
      className,
      ...rest
    }: React.PropsWithChildren<DialogPrimitive.DialogOverlayProps>,
    ref
  ) => {
    return (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "absolute left-0 top-0 z-modal h-screen w-screen bg-bAlpha-10 backdrop-blur-[2px]",
          className
        )}
        {...rest}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DialogPrimitive.DialogContentProps>
>(
  (
    {
      className,
      ...rest
    }: React.PropsWithChildren<DialogPrimitive.DialogContentProps>,
    ref
  ) => {
    return (
      <DialogPrimitive.Content
        {...rest}
        ref={ref}
        className={cn(
          "absolute z-modal border-2 border-neutral-12 bg-neutral-1 p-6 text-neutral-12 focus:outline-none",
          "max-h-[85vh] w-[90vw] max-w-[450px]",
          "flex flex-col",
          "absolute left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2",
          className
        )}
      />
    );
  }
);
DialogContent.displayName = "DialogContent";

export const DialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<DialogPrimitive.DialogCloseProps>
>(
  (
    {
      className,
      ...rest
    }: React.PropsWithChildren<DialogPrimitive.DialogCloseProps>,
    ref
  ) => {
    return (
      <DialogPrimitive.Close
        ref={ref}
        className={cn(
          "data-[state=open]:bg-accent absolute right-2 top-2 flex h-6 w-6  items-center justify-center hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:text-neutral-11",
          className
        )}
        {...rest}
      >
        <CloseIcon label="close" className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    );
  }
);
DialogCloseButton.displayName = "DialogCloseButton";
