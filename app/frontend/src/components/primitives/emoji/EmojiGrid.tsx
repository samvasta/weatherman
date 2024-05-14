import React from "react";

import { type GridListProps, VirtuosoGrid } from "react-virtuoso";

import { cn } from "@/utils/tailwind";

import { type EmojiProps, sizeLookup } from "./Emoji";
import { EmojiButton } from "./EmojiPickerButton";
import { EMOJI_COLS } from "./emojiData";
import { type EmojiInfo } from "./types";

type EmojiGridProps = {
  onSelect: (emoji: string) => void;
  emojiProps?: Partial<EmojiProps>;
  emojis: EmojiInfo[];
};

export function EmojiGrid({ onSelect, emojiProps, emojis }: EmojiGridProps) {
  const size = emojiProps?.size || "md";

  const finalSize =
    (typeof size === "string" || typeof size === "number"
      ? sizeLookup[size]
      : size) || sizeLookup.md;

  return (
    <VirtuosoGrid<EmojiInfo>
      data={emojis}
      style={{ minHeight: 400, height: "100%", flexGrow: 1 }}
      overscan={20}
      components={{
        List: Grid,
      }}
      itemContent={(_, data) => (
        <EmojiButton
          info={data}
          onSelect={onSelect}
          size={finalSize}
          props={{ ...emojiProps }}
        />
      )}
    />
  );
}

const Grid = React.forwardRef<HTMLDivElement, GridListProps>((ctx, ref) => (
  <div
    className={cn(`grid`, ctx.className)}
    style={{
      ...ctx.style,
      gridTemplateColumns: `repeat(${EMOJI_COLS}, 1fr)`,
    }}
    data-testid={(ctx as any)["data-test-id"]}
    ref={ref}
  >
    {ctx.children}
  </div>
));
Grid.displayName = "InnerEmojiGrid";
