import { type DataShape } from "./emojiData";

const GROUP_COLORS_START = -1000;

const GROUP_STORES_START = -900;
const GROUP_SERVICES_START = -800;

const swatchNames = [
  { color: "red", name: "poppy" },
  { color: "orange", name: "marigold" },
  { color: "yellow", name: "daffodil" },
  { color: "green", name: "basil" },
  { color: "teal", name: "hydrangea" },
  { color: "blue", name: "forget-me-not" },
  { color: "violet", name: "cornflower" },
  { color: "purple", name: "viola" },
  { color: "pink", name: "orchid" },
  { color: "gray", name: "pumice" },
  { color: "brown", name: "earth" },
];

export function addColors(emojis: DataShape) {
  swatchNames.forEach((col, idx) => {
    emojis.emojis[`_custom_col_${col.color}`] = {
      emoji: "",
      group: "Colors",
      subgroups: "",
      hexcode: `_custom_col_${col.color}`,
      name: col.name,
      order: GROUP_COLORS_START - swatchNames.length + idx,
      shortcodes: [col.color, col.name],
      tags: [col.color, "color", "dot", "circle"],
      spritesheet: null,
    };

    emojis.shortcodeLookup[col.color] = `_custom_col_${col.color}`;
    emojis.shortcodeLookup[col.name] = `_custom_col_${col.color}`;
  });
}

export function addStores(emojis: DataShape) {
  let order = GROUP_STORES_START;

  addStore(emojis, "Kroger", ["grocery", "food"], order++);
  addStore(emojis, "Sprouts", ["grocery", "food"], order++);
  addStore(emojis, "Albertsons", ["grocery", "food"], order++);
  addStore(emojis, "Costco", ["grocery", "food"], order++);
  addStore(emojis, "Amazon", ["online", "prime"], order++);
  addStore(emojis, "Walmart", ["grocery", "food"], order++);
  addStore(emojis, "Target", [], order++);
  addStore(emojis, "Petco", ["pet", "cat", "dog"], order++);
  addStore(emojis, "Braums", ["pet", "cat", "dog"], order++);
  addStore(emojis, "Lowes", ["home", "improvement", "hardware"], order++);
}

function addStore(
  emojis: DataShape,
  name: string,
  tags: string[],
  order: number
) {
  emojis.emojis[`_custom_store_${name.toLowerCase().replaceAll(/\s+/g, "_")}`] =
    {
      emoji: "",
      group: "Stores",
      subgroups: "",
      hexcode: `_custom_store_${name.toLowerCase().replaceAll(/\s+/g, "_")}`,
      name: name,
      order,
      shortcodes: [name.toLowerCase()],
      tags: [
        "store",
        "shop",
        "company",
        ...name.toLowerCase().split(" "),
        ...tags,
      ],
      spritesheet: null,
    };
  emojis.shortcodeLookup[name.toLowerCase()] = `_custom_store_${name
    .toLowerCase()
    .replaceAll(/\s+/g, "_")}`;
}

export function addServices(emojis: DataShape) {
  let order = GROUP_SERVICES_START;

  addService(
    emojis,
    "Spotify",
    ["streaming", "music", "subscription"],
    order++
  );
  addService(emojis, "HBO Max", ["streaming", "tv", "subscription"], order++);
  addService(emojis, "Viki", ["streaming", "tv", "subscription"], order++);
  addService(emojis, "Google Cloud", ["web"], order++);
}

function addService(
  emojis: DataShape,
  name: string,
  tags: string[],
  order: number
) {
  emojis.emojis[
    `_custom_service_${name.toLowerCase().replaceAll(/\s+/g, "_")}`
  ] = {
    emoji: "",
    group: "Subscriptions & Services",
    subgroups: "",
    hexcode: `_custom_service_${name.toLowerCase().replaceAll(/\s+/g, "_")}`,
    name: name,
    order,
    shortcodes: [name.toLowerCase()],
    tags: [
      "subscription",
      "service",
      "company",
      ...name.toLowerCase().split(" "),
      ...tags,
    ],
    spritesheet: null,
  };
  emojis.shortcodeLookup[name.toLowerCase()] = `_custom_service_${name
    .toLowerCase()
    .replaceAll(/\s+/g, "_")}`;
}
