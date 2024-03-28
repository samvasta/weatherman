import React, { type RefObject } from "react";
import { getInfo, getPath } from "./types";

type EmojiSize = {
  width: number;
  height: number;
};

export const sizeLookup = {
  xs: {
    width: 20,
    height: 20,
  },
  sm: {
    width: 26,
    height: 26,
  },
  md: {
    width: 32,
    height: 32,
  },
  lg: {
    width: 48,
    height: 48,
  },
  xl: {
    width: 64,
    height: 64,
  },
} satisfies {
  [size: string]: EmojiSize;
};

export type EmojiProps = {
  // Hexcode or shortcode - does not matter
  code: string;
  size: EmojiSize | keyof typeof sizeLookup;
  useSpritesheet?: boolean;
};

const EmojiComponent = React.forwardRef<HTMLDivElement, EmojiProps>(
  ({ code, size, useSpritesheet = false }: EmojiProps, ref) => {
    const finalSize =
      (typeof size === "string" || typeof size === "number"
        ? sizeLookup[size]
        : size) || sizeLookup.md;

    let emojiData = getInfo(code);

    if (!emojiData) {
      emojiData = getInfo("2753");
    }

    if (useSpritesheet && emojiData.spritesheet) {
      return (
        <div
          ref={ref}
          style={{
            backgroundImage: "url(/openmoji/out.png)",
            backgroundPosition: `-${32 * emojiData.spritesheet.col}px -${
              32 * emojiData.spritesheet.row
            }px`,
          }}
          className="h-[32px] w-[32px] bg-no-repeat"
        />
      );
    }

    return (
      <img
        ref={ref as RefObject<HTMLImageElement>}
        alt={emojiData.name}
        src={getPath(code)}
        width={finalSize.width}
        height={finalSize.height}
      />
    );
  }
);
EmojiComponent.displayName = "EmojiInner";

export const Emoji = React.memo(EmojiComponent);
Emoji.displayName = "Emoji";
