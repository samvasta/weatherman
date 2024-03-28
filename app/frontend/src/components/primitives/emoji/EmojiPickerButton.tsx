import { memo } from "react";

import { Button } from "../button/Button";
import { Tooltip } from "../floating/tooltip/Tooltip";
import { Emoji, type EmojiProps } from "./Emoji";
import { type EmojiInfo } from "./types";

function InnerEmojiButton({
  info,
  size,
  onSelect,
  props,
}: {
  info: EmojiInfo;
  size: EmojiProps["size"];
  onSelect?: (hexcode: string) => void;
  props?: Partial<EmojiProps>;
}) {
  return (
    <Tooltip
      content={info.name}
      skipDelayDuration={1500}
      disableHoverableContent
    >
      {onSelect ? (
        <Button
          variant="ghost"
          onClick={() => onSelect(info.hexcode)}
          className="h-fit max-h-max w-fit !p-tight/2"
        >
          <Emoji {...props} size={size} code={info.hexcode} />
        </Button>
      ) : (
        <div className="h-fit max-h-max w-fit !p-tight/2">
          <Emoji {...props} size={size} code={info.hexcode} />
        </div>
      )}
    </Tooltip>
  );
}
export const EmojiButton = memo(InnerEmojiButton);
