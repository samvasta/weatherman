/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";

import { Txt } from "@/components/primitives/text/Text";

import { type PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Popover as PopoverComponent, type PopoverProps } from "./Popover";

type PlaygroundProps = React.PropsWithChildren<PopoverProps> &
  (
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants: any[];
        getArgs: (
          args: React.PropsWithChildren<PopoverProps>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant: any
        ) => React.PropsWithChildren<PopoverProps>;
      }
    | { variants?: never; getArgs?: never }
  );

const render = ({ variants, getArgs, ...args }: PlaygroundProps) => {
  if (variants && variants.length > 0) {
    return (
      <div className="grid grid-cols-2 place-items-center gap-12 text-center text-neutral-12">
        {variants.map((variant, idx) => (
          <PopoverComponent
            key={`variant-${idx}`}
            {...getArgs(args, variant)}
          />
        ))}
      </div>
    );
  } else {
    return <PopoverComponent {...args} />;
  }
};

export const PopoverMeta: PlaygroundComponent<PlaygroundProps> = {
  name: "Popover",
  Component: render,
  Preview: render,
  defaultProps: {
    content: <Txt>This is the popover content</Txt>,
    children: (
      <Txt className="w-fit">
        This is the popover trigger. Click it to open the popover
      </Txt>
    ),
  },
  variants: [
    {
      name: "Color Scheme",
      props: {
        variants: [
          "neutral",
          "primary",
          "secondary",
          "tertiary",
          "success",
          "danger",
          "info",
        ],
        getArgs: (a, v) => ({
          ...a,
          colorScheme: v,
          children: <Txt>This has a {v} color scheme</Txt>,
        }),
      },
    },
    {
      name: "Explicit Close",
      props: {
        explicitClose: true,
        content: (
          <Txt>
            The popover cannot be dismissed without clicking the X button.
          </Txt>
        ),
      },
    },
    {
      name: "Side",
      props: {
        variants: ["top", "right", "left", "bottom"],
        getArgs: (a, v) => ({
          ...a,
          contentProps: { ...a.contentProps, side: v },
          children: <Txt>This will open on the {v} side</Txt>,
        }),
      },
    },
  ],
};