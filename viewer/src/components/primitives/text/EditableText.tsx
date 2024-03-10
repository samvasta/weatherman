import React from "react";

import { CheckIcon } from "@/icons/svgs/Check";
import { CloseIcon } from "@/icons/svgs/Close";
import { PencilIcon } from "@/icons/svgs/Pencil";
import { cn } from "@/utils/tailwind";

import { IconButton } from "../button/Button";
import { Input, type InputProps } from "../input/Input";
import { type TextProps, Txt } from "./Text";

const inputToTxtSize = {
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
} as const;

export type EditableTextProps = {
  value: string;
  onChange: (value: string) => Promise<void> | void;
  textProps?: Omit<TextProps, "size" | "className" | "onChange">;
} & Omit<InputProps, "onChange" | "value">;
export function EditableText({
  value: valueProp,
  onChange,
  size,
  className,
  textProps,
  ...inputProps
}: EditableTextProps) {
  const [value, setValue] = React.useState(valueProp);
  const [isEditing, setEditing] = React.useState(false);

  React.useEffect(() => setValue(valueProp), [valueProp]);

  const onSubmit = async () => {
    if (value !== valueProp) {
      await onChange(value);
    }
    setEditing(false);
  };

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-0", className)}>
        <Input
          {...inputProps}
          className={"min-w-[280px]"}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          size={size}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          onKeyDownCapture={(e) => {
            if (e.code === "Escape") {
              setValue(valueProp);
              setEditing(false);
            } else if (e.code === "Tab") {
              void onSubmit();
            }
          }}
        />
        <IconButton
          onClick={() => {
            setValue(valueProp);
            setEditing(false);
          }}
          variant="ghost"
          size={size}
        >
          <CloseIcon label="cancel" />
        </IconButton>
        <IconButton onClick={() => onSubmit()} variant="ghost" size={size}>
          <CheckIcon label="save" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-tight", className)}>
      <Txt
        size={inputToTxtSize[size as keyof typeof inputToTxtSize]}
        {...textProps}
      >
        {value}
      </Txt>
      <IconButton
        onClick={() => {
          setEditing(true);
        }}
        variant="ghost"
        size={size}
      >
        <PencilIcon className="text-neutral-10" label="Edit" />
      </IconButton>
    </div>
  );
}
