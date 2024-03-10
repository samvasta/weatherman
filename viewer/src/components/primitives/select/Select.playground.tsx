import React, { useState } from "react";

import { type PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { MagnifyingGlassIcon } from "@/icons/svgs/MagnifyingGlass";
import { TargetIcon } from "@/icons/svgs/Target";

import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from ".";
import { Txt } from "../text/Text";
import { SimpleSelect, type SimpleSelectProps } from "./SimpleSelect";

type Data = { id: string; name: string; age: number };

const data: Data[] = [
  {
    id: "1",
    name: "Bob",
    age: 40,
  },
  {
    id: "2",
    name: "Linda",
    age: 38,
  },
  {
    id: "3",
    name: "Tina",
    age: 12,
  },
  {
    id: "4",
    name: "Gene",
    age: 10,
  },
  {
    id: "5",
    name: "Louise",
    age: 8,
  },
];

const Playground = (args: SimpleSelectProps<Data>) => {
  const [selected, setSelected] = useState("1");

  return (
    <SimpleSelect<Data>
      placeholder="Select somebody"
      trigger={{
        className: "w-[250px] min-w-fit",
      }}
      {...args}
      onSelect={(item) => setSelected(item.id)}
      selectedId={selected}
    />
  );
};

export const SelectMeta: PlaygroundComponent<SimpleSelectProps<Data>> = {
  name: "Select",
  Component: Playground,
  Preview: () => {
    return (
      <SelectComponent>
        <SelectTrigger className="w-max" icon={MagnifyingGlassIcon}>
          <SelectValue placeholder="Choose something" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <TargetIcon label="target" /> Light
          </SelectItem>
          <SelectItem value="dark">
            Option with a really long name. Super long
          </SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </SelectComponent>
    );
  },
  defaultProps: {
    items: data.map((item) => ({
      label: item.name,
      value: item,
    })),
    onSelect: () => 0,
    selectedId: "1",
    placeholder: "Select somebody!",
  },
  variants: [
    {
      name: "Simple",
      props: {},
    },
    {
      name: "Custom Icon",
      props: {
        trigger: {
          className: "w-[250px] min-w-fit",
          icon: MagnifyingGlassIcon,
        },
      },
    },
    {
      name: "Custom Render",
      props: {
        renderItem: (item) => (
          <div>
            <Txt className="font-bold" size="lg">
              {item.name}
            </Txt>

            <Txt className="italic" size="md" intent="subtle">
              {item.age}
            </Txt>
          </div>
        ),
      },
    },
  ],
};
