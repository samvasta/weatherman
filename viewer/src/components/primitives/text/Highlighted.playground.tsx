import type { PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Highlighted, type HighlightedProps } from "./Highlighted";

export const HighlightedMeta: PlaygroundComponent<HighlightedProps> = {
  name: "Highlighted Text",
  Preview: Highlighted,
  Component: Highlighted,
  defaultProps: {
    children: "Highlighted text adds emphasis to your words",
    pattern: "emphasis",
  },
  variants: [
    {
      name: "Default",
      props: { colorScheme: "primary" },
    },
    {
      name: "Secondary",
      props: { colorScheme: "secondary" },
    },
    {
      name: "Tertiary",
      props: { colorScheme: "tertiary" },
    },
  ],
};
