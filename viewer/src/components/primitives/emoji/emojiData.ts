import { groupBy } from "@/utils/groupBy";

import { addColors, addServices, addStores } from "./custom";
import data from "./data.json";
import { type EmojiInfo } from "./types";

export type DataShape = {
  emojis: { [hexcode: string]: EmojiInfo };
  shortcodeLookup: { [shortcode: string]: string };
};

function compareEmoji(a: EmojiInfo, b: EmojiInfo) {
  return (a.order || Number.MAX_VALUE) - (b.order || Number.MAX_VALUE);
}

export const emojiData: DataShape = (() => {
  const emojis = data as DataShape;

  addColors(emojis);
  addStores(emojis);
  addServices(emojis);

  return emojis;
})();

let initialized = false;
let sortedEmojis: EmojiInfo[] = [];

let groupedAndSortedEmojis: { [group: string | number]: EmojiInfo[] } = {};

export const EMOJI_COLS = 8;
let groupData: {
  groupCounts: number[];
  groupNames: string[];
  groupedRows: EmojiInfo[][];
};

function initData() {
  if (initialized) {
    return;
  }

  sortedEmojis = Object.values(emojiData.emojis)
    .filter((emoji) => !emoji.name.includes("skin tone"))
    .sort(compareEmoji);

  groupedAndSortedEmojis = groupBy(sortedEmojis, (info) => info.group);

  for (const group of Object.values(groupedAndSortedEmojis)) {
    group.sort(compareEmoji);
  }

  const groupedRows = Object.entries(groupedAndSortedEmojis).map(
    ([group, emojis]) => {
      const rows: EmojiInfo[][] = emojis.reduce((rows, emoji, idx) => {
        if (idx % EMOJI_COLS === 0) {
          rows.push([] as EmojiInfo[]);
        }
        rows[rows.length - 1].push(emoji);

        return rows;
      }, [] as EmojiInfo[][]);
      return {
        group,
        rows,
      };
    }
  );

  groupData = {
    groupCounts: groupedRows.map((group) => group.rows.length),
    groupNames: groupedRows.map((group) => group.group),
    groupedRows: groupedRows.flatMap((group) => group.rows),
  };

  initialized = true;
}

initData();

export function getSortedEmojis() {
  return sortedEmojis;
}

export function getGroupedAndSortedEmojis() {
  return groupedAndSortedEmojis;
}

export function getGroupedEmojiData() {
  return groupData;
}
