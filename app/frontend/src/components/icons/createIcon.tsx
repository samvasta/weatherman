import React from "react";

import { AccessibleIcon } from "@radix-ui/react-accessible-icon";

import { cn } from "@/utils/tailwind";

export type IconSize = {
  width: number;
  height: number;
};

export const sizeLookup = {
  xs: {
    width: 16,
    height: 16,
  },
  sm: {
    width: 20,
    height: 20,
  },
  md: {
    width: 24,
    height: 24,
  },
  lg: {
    width: 32,
    height: 32,
  },
  xl: {
    width: 48,
    height: 48,
  },
  "2xl": {
    width: 64,
    height: 64,
  },
} satisfies {
  [size: string]: IconSize;
};

type CreateIconProps = {
  displayName: string;
  path: React.ReactNode;
  className?: string;
  defaultProps?: Partial<IconProps>;
} & Omit<
  React.SVGAttributes<SVGSVGElement>,
  "path" | "className" | "width" | "height"
>;

export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  label: string;
  size?: IconSize | keyof typeof sizeLookup;
};

export function createIcon({
  displayName,
  path,
  className,
  defaultProps,
  ...svgProps
}: CreateIconProps) {
  const memoizedIcon = React.memo(
    React.forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
      const {
        className: instanceClassName,
        label,
        size,
        ...rest
      } = { ...defaultProps, ...props };
      const finalSize =
        (typeof size === "string" || typeof size === "number"
          ? sizeLookup[size]
          : size) || sizeLookup.md;

      return (
        <AccessibleIcon label={label}>
          <svg
            ref={ref}
            {...svgProps}
            className={cn(
              "fill-current stroke-none text-current",
              className,
              instanceClassName
            )}
            {...finalSize}
            {...rest}
          >
            {path}
          </svg>
        </AccessibleIcon>
      );
    })
  );

  memoizedIcon.displayName = displayName;

  return memoizedIcon;
}
