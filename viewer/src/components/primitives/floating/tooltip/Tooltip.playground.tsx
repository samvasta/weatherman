/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";

import { Txt } from "@/components/primitives/text/Text";

import { type PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Tooltip as TooltipComponent, type TooltipProps } from "./Tooltip";

type PlaygroundProps = React.PropsWithChildren<TooltipProps> &
  (
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants: any[];
        getArgs: (
          args: React.PropsWithChildren<TooltipProps>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant: any
        ) => React.PropsWithChildren<TooltipProps>;
      }
    | { variants?: never; getArgs?: never }
  );

const render = ({ variants, getArgs, ...args }: PlaygroundProps) => {
  if (variants && variants.length > 0) {
    return (
      <div className="grid grid-cols-2 place-items-center gap-12 text-center text-neutral-12">
        {variants.map((variant, idx) => (
          <TooltipComponent
            key={`variant-${idx}`}
            {...getArgs(args, variant)}
          />
        ))}
      </div>
    );
  } else {
    return <TooltipComponent {...args} />;
  }
};

export const TooltipMeta: PlaygroundComponent<PlaygroundProps> = {
  name: "Tooltip",
  Component: render,
  Preview: render,
  defaultProps: {
    content: <Txt>This is the tooltip content</Txt>,
    children: (
      <Txt className="w-fit">
        This is the tooltip trigger. Click it to open the tooltip
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
      name: "Side",
      props: {
        variants: ["top", "right", "left", "bottom"],
        getArgs: (a, v) => ({
          ...a,
          side: v,
          children: <Txt>This will open on the {v} side</Txt>,
        }),
      },
    },
  ],
};
