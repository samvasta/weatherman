import React from "react";

import { LockIcon, LockOpenIcon } from "lucide-react";

import { cn } from "@/utils/tailwind";
import { KeyOfType } from "@/utils/types";

import { Checkbox } from "../primitives/checkbox/Checkbox";
import { Tooltip } from "../primitives/floating/tooltip/Tooltip";

export type SheetEditableInputProps<
  TData,
  TKey extends KeyOfType<TData, boolean>,
> = {
  data: TData;
  flagKey: TKey;
  onChange: (nextData: TData) => void;
};

export function SheetEditableInput<
  TData,
  TKey extends KeyOfType<TData, boolean>,
>({
  data,
  flagKey,
  onChange,
  className,
  children,
  ...rest
}: SheetEditableInputProps<TData, TKey> &
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const isSheetEditable = data[flagKey] as boolean;

  const icon = React.useMemo(
    () => (isSheetEditable ? <LockOpenIcon /> : <LockIcon />),
    [isSheetEditable]
  );

  return (
    <div className={cn("flex items-center gap-2", className)} {...rest}>
      {children}
      <Tooltip
        content={
          isSheetEditable
            ? "Allow people to edit this value in input sheets"
            : "Don't let people edit this value in input sheets"
        }
      >
        <Checkbox
          size="md"
          className="p-0"
          checked={isSheetEditable}
          onCheckedChange={(e) => {
            if (Boolean(e) !== isSheetEditable) {
              onChange({ ...data, [flagKey]: Boolean(e) });
            }
          }}
        >
          {icon}
        </Checkbox>
      </Tooltip>
    </div>
  );
}
