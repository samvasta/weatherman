import { emojiData } from "./emojiData";

export type EmojiInfo = {
  emoji: string;
  hexcode: string;

  name: string;
  shortcodes: string[];

  group: string;
  subgroups: string;

  tags: string[];

  order: number | null;

  spritesheet: null | {
    row: number;
    col: number;
  };
};

export function isShortcode(code: string): boolean {
  return /:[\w]+:/g.test(code);
}

function shortcodeToHexcode(shortcode: string): string {
  return emojiData.shortcodeLookup[shortcode.replaceAll(":", "")];
}

export function getPath(code: string): string {
  const isShort = isShortcode(code);
  if (!isShort) {
    return `/openmoji/${code}.svg`;
  }
  const hexcode = shortcodeToHexcode(code);
  if (hexcode) {
    return `/openmoji/${hexcode}.svg`;
  } else {
    return "/openmoji/2753.svg";
  }
}

export function getInfo(code: string): EmojiInfo {
  const isShort = isShortcode(code);
  if (isShort) {
    const hexcode = shortcodeToHexcode(code);
    if (!hexcode) {
      return emojiData.emojis["2753"];
    }
    return emojiData.emojis[hexcode];
  }
  return emojiData.emojis[code];
}
