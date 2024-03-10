import React from "react";

import { GroupedVirtuoso } from "react-virtuoso";

import { Heading } from "../text/Heading";
import { type EmojiProps, sizeLookup } from "./Emoji";
import { EmojiButton } from "./EmojiPickerButton";
import { getGroupedEmojiData } from "./emojiData";

type EmojiListProps = {
  onSelect?: (emoji: string) => void;
  emojiProps?: Partial<EmojiProps>;
};

export const CategorizedEmojiList = React.memo(InnerCategorizedEmojiList);

function InnerCategorizedEmojiList({ onSelect, emojiProps }: EmojiListProps) {
  const { groupCounts, groupNames, groupedRows } = getGroupedEmojiData();

  const size = emojiProps?.size || "md";

  const finalSize =
    (typeof size === "string" || typeof size === "number"
      ? sizeLookup[size]
      : size) || sizeLookup.md;

  return (
    <GroupedVirtuoso
      groupCounts={groupCounts}
      style={{ minHeight: 400, height: "100%", flexGrow: 1 }}
      groupContent={(index) => {
        return (
          <Heading size="md" className="my-1 bg-neutral-1 capitalize">
            {groupNames[index].replaceAll("-", " & ")}
          </Heading>
        );
      }}
      itemContent={(index) => {
        return (
          <div className="grid grid-cols-8">
            {groupedRows[index].map((info) => {
              return (
                <EmojiButton
                  key={info.hexcode}
                  info={info}
                  onSelect={onSelect}
                  size={finalSize}
                  props={emojiProps}
                />
              );
            })}
          </div>
        );
      }}
    />
  );
}
