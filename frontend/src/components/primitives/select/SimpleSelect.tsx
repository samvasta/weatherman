import { Root, Value } from "@radix-ui/react-select";

import { cn } from "@/utils/tailwind";

import { Input } from "../input/Input";
import { SelectContent } from "./SelectContent";
import { SelectItem } from "./SelectItem";
import { SelectTrigger, type SelectTriggerProps } from "./SelectTrigger";

export type SelectItemData<T extends { id: string }> = {
  label: string;
  extraContent?: React.ReactNode;
  value: T;
};

export type SimpleSelectProps<T extends { id: string }> = {
  items: SelectItemData<T>[];
  selectedId: string;
  renderItem?: (item: T) => React.ReactNode;
  onSelect: (selected: T) => void;
  placeholder?: string;
  trigger?: SelectTriggerProps;
  enableSearch?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

export function SimpleSelect<T extends { id: string }>({
  items,
  selectedId,
  renderItem,
  onSelect,
  placeholder,
  trigger,
  enableSearch = false,
  ref,
}: SimpleSelectProps<T>) {
  const { className: triggerClass, ...triggerProps } = trigger || {};
  return (
    <Root
      value={selectedId}
      onValueChange={(value) => {
        const match = items.find((item) => item.value.id === value);
        if (match) {
          onSelect(match.value);
        }
      }}
    >
      <SelectTrigger
        {...triggerProps}
        className={cn("h-full", triggerClass)}
        ref={ref}
      >
        <Value placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {enableSearch && <Input variant="inline" placeholder="Filter" />}
        {items.map((item) => {
          return (
            <SelectItem key={item.value.id} value={item.value.id}>
              {renderItem ? (
                renderItem(item.value)
              ) : (
                <>
                  {item.extraContent && (
                    <div className="mr-1">{item.extraContent}</div>
                  )}
                  {item.label}
                </>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Root>
  );
}
