import { SearchableEmojiList } from "@/components/emoji-picker/SearchableEmojiList";
import type { PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Emoji, type EmojiProps } from "./Emoji";

export const EmojiMeta: PlaygroundComponent<EmojiProps> = {
  Component: RenderEmojiPlayground,
  Preview: Emoji,
  defaultProps: {
    code: ":smile:",
    size: {
      width: 96,
      height: 96,
    },
  },
  name: "Emoji",
  variants: [
    {
      name: "All emojis",
      props: {
        code: "2753",
      },
    },
  ],
};

function RenderEmojiPlayground(args: EmojiProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <SearchableEmojiList
        emojiProps={args}
        searchClassName="w-full"
        listClassName="h-full min-h-[600px] flex flex-col"
        inputProps={{
          variant: "outline",
          placeholder: "Search for an emoji",
        }}
      />
    </div>
  );
}
