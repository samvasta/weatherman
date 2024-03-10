import React from "react";

import { MoneyValue } from "@/components/primitives/money/MoneyValue";
import { Separator } from "@/components/primitives/separator/Separator";

import { type PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Heading } from "./Heading";
import { Txt } from "./Text";

const Typography = () => {
  return (
    <div className="flex flex-col gap-6 text-neutral-12">
      <Heading size="display1">Display 1</Heading>
      <Heading size="display2">Display 2</Heading>
      <Heading size="display3">Display 3</Heading>
      <div>
        <Heading size="2xl">2xl Heading</Heading>
        <Txt size="2xl">
          2xl text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>
      <div>
        <Heading size="xl">xl Heading</Heading>
        <Txt size="xl">
          xl text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>

      <div>
        <Heading size="lg">lg Heading</Heading>
        <Txt size="lg">
          lg text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>

      <div>
        <Heading size="md">md Heading</Heading>
        <Txt size="md">
          md text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>

      <div>
        <Heading size="sm">sm Heading</Heading>
        <Txt size="sm">
          sm text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>

      <div>
        <Heading size="xs">xs Heading</Heading>
        <Txt size="xs">
          xs text Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloribus aut ratione obcaecati assumenda adipisci ipsa placeat
          eligendi illum? Cumque sunt voluptatem, atque dicta ratione molestias
          architecto sequi voluptas odio eligendi?
        </Txt>
      </div>
      <Separator />
      <div>
        <Heading size="md">Subtle Text</Heading>
        <Txt intent="subtle" size="md">
          This is subtle text. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Doloribus aut ratione obcaecati assumenda adipisci
          ipsa placeat eligendi illum? Cumque sunt voluptatem, atque dicta
          ratione molestias architecto sequi voluptas odio eligendi?
        </Txt>
      </div>

      <Separator />
      <div>
        <Heading size="md">Disabled Text</Heading>
        <Txt intent="disabled" size="md">
          This is disabled text. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Doloribus aut ratione obcaecati assumenda adipisci
          ipsa placeat eligendi illum? Cumque sunt voluptatem, atque dicta
          ratione molestias architecto sequi voluptas odio eligendi?
        </Txt>
      </div>
      <Separator />
      <div className="space-y-regular">
        <Heading size="display3">Money Values</Heading>

        <Heading intent="subtle" size="sm">
          Default styling
        </Heading>
        <MoneyValue amount={12345} />
        <MoneyValue amount={-12345} />
        <MoneyValue amount={-12345678} />

        <Heading intent="subtle" size="sm">
          Relative change
        </Heading>
        <MoneyValue amount={12345} isRelativeChange />
        <MoneyValue amount={-12345} isRelativeChange />
        <Heading intent="subtle" size="sm">
          Abbrevaited
        </Heading>
        <MoneyValue amount={12345678} abbreviate />
        <MoneyValue amount={-12345678} abbreviate isRelativeChange />
        <MoneyValue amount={-12345678} abbreviate isRelativeChange />

        <Heading intent="subtle" size="sm">
          Highlighted negative values
        </Heading>
        <MoneyValue amount={-12345678} highlightNegative />
        <MoneyValue amount={-12345678} highlightNegative abbreviate />
        <MoneyValue
          amount={-12345678}
          highlightNegative
          abbreviate
          isRelativeChange
        />
      </div>
    </div>
  );
};

export const TypographyMeta: PlaygroundComponent<{}> = {
  Component: Typography,
  defaultProps: {},
  name: "Typography",
  Preview: () => (
    <div>
      <Heading size="display3">lorem</Heading>
      <Txt>ipsum dolor sit</Txt>
      <Txt intent="subtle">amet consectetur adipisicing elit.</Txt>
    </div>
  ),
  variants: [
    {
      name: "Typography",
      props: {},
    },
  ],
};
