import { useEffect } from "react";
import React from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNodesInitialized, useReactFlow } from "reactflow";
import { useFilePicker } from "use-file-picker";
import {
  type FileWithPath,
  type SelectedFiles,
  type UseFilePickerConfig,
} from "use-file-picker/types";
import { Validator } from "use-file-picker/validators";

import { Button } from "@/components/primitives/button/Button";
import { Dialog } from "@/components/primitives/floating/dialog/Dialog";
import { Input } from "@/components/primitives/input/Input";
import { Txt } from "@/components/primitives/text/Text";

import { type Model, ModelSchema } from "@/types/model";
import { api } from "@/utils/api";

import {
  compiledModelAtom,
  fileNameAtom,
  hasErrorsAtom,
  initializeNodeNamesMapAtom,
  simulationResultAtom,
} from "./atoms";
import useLayoutNodes from "./useLayoutNodes";
import { variablesToNodesAndEdges } from "./useNodesAndEdges";

class ModelValidator extends Validator {
  async validateBeforeParsing() {
    return new Promise<void>((res, _rej) => res());
  }
  async validateAfterParsing(
    _config: UseFilePickerConfig<unknown>,
    file: FileWithPath,
    _reader: FileReader
  ) {
    return new Promise<void>(async (res, rej) => {
      const content = await file.text();

      const data = JSON.parse(content) as unknown;

      const parseResult = ModelSchema.safeParse(data);

      if (parseResult.success) {
        res();
      } else {
        rej(parseResult);
      }
    });
  }
}

export function Menu() {
  const autoLayoutNodes = useLayoutNodes();

  const { setNodes, setEdges } = useReactFlow();

  const isInitialized = useNodesInitialized();
  const [hasInitialized, setHasInitialized] = React.useState(isInitialized);
  const [simulationResult, setSimulationResult] = useAtom(simulationResultAtom);

  const [compiledModel, setCompiledModel] = useAtom(compiledModelAtom);
  const hasErrors = useAtomValue(hasErrorsAtom);
  const setFileName = useSetAtom(fileNameAtom);
  const initializeNodeNamesMap = useSetAtom(initializeNodeNamesMapAtom);

  const simulate = api.simulate.go.useMutation({
    onSuccess: (data) => {
      setSimulationResult(data);
    },
  });

  useEffect(() => {
    if (!hasInitialized && isInitialized) {
      void autoLayoutNodes();
      setHasInitialized(true);
    }
  }, [hasInitialized, isInitialized]);

  const { openFilePicker } = useFilePicker({
    accept: ".json",
    multiple: false,
    onFilesSelected(data) {
      // @typescript-eslint/no-unsafe-member-access
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const filesContent = (data as SelectedFiles<string>).filesContent;

      if (filesContent.length > 0) {
        const file = filesContent[0]!;
        setFileName(file.name);
        const model = JSON.parse(file.content) as Model;
        const { nodes, edges, nodeNameToId } = variablesToNodesAndEdges(
          model.variables
        );

        setNodes(nodes);
        setEdges(edges);
        initializeNodeNamesMap(nodeNameToId);
        setCompiledModel(model);
        setHasInitialized(false);
      }
    },
    validators: [new ModelValidator()],
  });

  return (
    <div className="absolute left-0 top-0 z-30 flex w-screen justify-start gap-4 border-b-4 bg-neutral-3 px-2 py-1">
      <Button
        variant="link"
        colorScheme="neutral"
        className="w-fit"
        onClick={() => openFilePicker()}
      >
        Import
      </Button>
      <Dialog
        usePortal
        content={({ onClose }) => <SaveDialog onClose={onClose} />}
      >
        <Button
          variant="link"
          colorScheme="neutral"
          className="w-fit"
          disabled={hasErrors}
        >
          Export
        </Button>
      </Dialog>
      <Button
        variant="link"
        colorScheme="neutral"
        className="w-fit"
        onClick={() => autoLayoutNodes()}
      >
        Auto-layout
      </Button>
      {simulationResult === null ? (
        <Button
          variant="link"
          colorScheme="neutral"
          className="w-fit"
          disabled={hasErrors || simulate.isLoading}
          onClick={() => {
            if (!hasErrors) {
              void simulate.mutateAsync({
                model: compiledModel,
                iterations: 10000,
                steps: 50,
              });
            }
          }}
        >
          Run
          {simulate.isLoading && "ning..."}
        </Button>
      ) : (
        <Button
          variant="link"
          colorScheme="neutral"
          className="w-fit"
          onClick={() => setSimulationResult(null)}
        >
          Clear Results
        </Button>
      )}
    </div>
  );
}

function SaveDialog({ onClose }: { onClose: () => void }) {
  const compiledModel = useAtomValue(compiledModelAtom);
  const hasErrors = useAtomValue(hasErrorsAtom);

  const [fileName, setFileName] = useAtom(fileNameAtom);

  const saveFile = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(compiledModel)])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.json`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode!.removeChild(link);
    onClose();
  };

  return (
    <div className="space-y-4">
      <Txt>Save as</Txt>
      <Input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        autoFocus
      />
      <div className="flex w-full items-center justify-end gap-4">
        <Button variant="ghost" colorScheme="neutral" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          variant="solid"
          colorScheme="primary"
          disabled={hasErrors || !fileName}
          onClick={() => {
            saveFile();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
