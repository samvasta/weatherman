import React from "react";

import { useMergedRef } from "@mantine/hooks";
import { type DropzoneOptions, useDropzone } from "react-dropzone";

import { cn } from "@/utils/tailwind";

import { buttonVariants } from "../button/Button";
import { Txt } from "../text/Text";

export type FileDropInputProps = Omit<
  DropzoneOptions,
  "onDrop" | "onDropAccepted" | "onDropRejected"
> & {
  onFileChanged: (file: File) => void;
};

export const FileDropInput = React.forwardRef<
  HTMLInputElement,
  FileDropInputProps
>(({ onFileChanged, ...dropzoneOptions }: FileDropInputProps, ref) => {
  const [file, setFile] = React.useState<File | null>(null);
  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    ...dropzoneOptions,

    onDrop: (files: File[]) => {
      if (files.length > 0) {
        setFile(files[0]);
        onFileChanged(files[0]);
      }
    },
  });

  const finalInputRef = useMergedRef(inputRef, ref);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-max min-w-[20rem]",
        buttonVariants({ colorScheme: "tertiary", variant: "solid" }),
        "h-12 px-xtight py-xtight"
      )}
    >
      <div
        className={cn(
          "border-tertiary-12 box-content inline-flex w-full items-center border-0 border-dashed p-xtight",
          {
            border: isDragActive,
          }
        )}
      >
        <input {...getInputProps()} ref={finalInputRef} />
        {isDragActive ? (
          <Txt>Drop your .csv here</Txt>
        ) : file ? (
          <Txt>{file.name}</Txt>
        ) : (
          <Txt className="text-tertiary-11" intent="subtle">
            Drop a csv here, or click to select a file.
          </Txt>
        )}
      </div>
    </div>
  );
});

FileDropInput.displayName = "FileDropInput";
