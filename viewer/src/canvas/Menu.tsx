import { useEffect } from "react";
import React from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CheckCircleIcon, PlayIcon, TriangleAlertIcon } from "lucide-react";
import { useNodesInitialized, useReactFlow, useStoreApi } from "reactflow";
import { useFilePicker } from "use-file-picker";
import {
  type FileWithPath,
  type SelectedFiles,
  type UseFilePickerConfig,
} from "use-file-picker/types";
import { Validator } from "use-file-picker/validators";

import { Button } from "@/components/primitives/button/Button";
import { Dialog } from "@/components/primitives/floating/dialog/Dialog";
import { Tooltip } from "@/components/primitives/floating/tooltip/Tooltip";
import { Input } from "@/components/primitives/input/Input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/primitives/menubar/Menubar";
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
  const store = useStoreApi();

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

        setNodes([]);
        setEdges([]);
        setNodes(nodes);
        setEdges(edges);
        initializeNodeNamesMap(nodeNameToId);
        setCompiledModel(model);
        setSimulationResult(null);
        setHasInitialized(false);
      }
    },
    validators: [new ModelValidator()],
  });

  return (
    <div className="flex w-screen justify-start gap-4 border-b-4 bg-neutral-3 px-2 py-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => openFilePicker()}>Import</MenubarItem>
            <MenubarItem disabled={hasErrors} asChild>
              <Dialog
                usePortal
                content={({ onClose }) => <SaveDialog onClose={onClose} />}
              >
                <Button
                  variant="ghost"
                  colorScheme="primary"
                  size="md"
                  className="w-full justify-start px-2 text-sm font-normal text-neutral-12"
                >
                  Export
                </Button>
              </Dialog>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Model</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => autoLayoutNodes()}>
              Auto-layout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button variant="link" size="sm" className="text-neutral-12">
              Simulate
              {simulationResult === null && hasErrors ? (
                <Tooltip
                  content="Cannot simulate because the model has errors."
                  colorScheme="warning"
                >
                  <TriangleAlertIcon className="h-4 w-4 -translate-y-0.5 fill-swatches-yellow text-neutral-12" />
                </Tooltip>
              ) : simulate.isLoading ? (
                <div className="absolute right-0 top-0 grid h-4 w-4 translate-x-1/2 place-items-center rounded-full bg-primary-8 p-0.5">
                  <PlayIcon className="h-2.5 w-2.5 fill-neutral-13" />
                </div>
              ) : simulationResult !== null ? (
                <CheckCircleIcon className="absolute right-0 top-0 h-4 w-4 translate-x-1/2 rounded-full bg-primary-8 text-neutral-13" />
              ) : null}
            </Button>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              disabled={hasErrors || simulationResult !== null}
              onSelect={() => {
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
            </MenubarItem>

            <MenubarItem
              disabled={simulationResult === null}
              onSelect={() => setSimulationResult(null)}
            >
              Clear Results
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
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
