import * as React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/utils/tailwind";

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    referrerPolicy="no-referrer"
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

function getInitials(str: string): string {
  return str.substring(0, 2).toUpperCase();
}
function getHue(str: string): number {
  let num = 0;

  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i) * str.charCodeAt(i) * (i + 1);
  }

  return num % 360;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => {
  const initials = React.useMemo(() => {
    if (typeof children === "string") {
      return getInitials(children);
    }
    return null;
  }, [children]);

  const hue = React.useMemo(() => getHue(initials || "??"), [initials]);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full p-0 font-semibold",
        className
      )}
      style={{
        backgroundColor: `oklch(77.41% 0.038 ${hue})`,
      }}
      {...props}
    >
      {initials || children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export type AvatarProps = {
  src?: string | undefined | null;
  fallback: string;
};
export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarProps
>(({ src, fallback, ...rootProps }, ref) => (
  <AvatarRoot {...rootProps} ref={ref}>
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback}</AvatarFallback>
  </AvatarRoot>
));
Avatar.displayName = "Avatar";
