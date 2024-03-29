import { useEffect } from "react";
import React from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  CheckCircleIcon,
  CheckIcon,
  PlayIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useNodesInitialized, useReactFlow, useStoreApi } from "reactflow";
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
  MenubarGroup,
  MenubarItem,
  MenubarItemIndicator,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/primitives/menubar/Menubar";
import { Txt } from "@/components/primitives/text/Text";

import { type Model, ModelSchema } from "@/types/model";
import {
  getCompiledModelAtom,
  hasErrorsAtom,
  initializeNodeNamesMapAtom,
  setCompiledModelAtom,
  simulationResultAtom,
} from "./atoms";
import useLayoutNodes from "./useLayoutNodes";
import { variablesToNodesAndEdges } from "./useNodesAndEdges";
import {
  LoadFile,
  SaveFile,
  SaveFileAs,
  ClearModel,
  Simulate,
} from "~/go/main/App";
import {
  AnyVariableData,
  AnyVariableSchema,
} from "@/types/variables/allVariables";
import { SimulationResult } from "@/types/results";

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

  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simSettings, setSimSettings] = React.useState({
    steps: 50,
    iterations: 5000,
  });
  const [simulationResult, setSimulationResult] = useAtom(simulationResultAtom);

  const compiledModel = useAtomValue(getCompiledModelAtom);
  const setCompiledModel = useSetAtom(setCompiledModelAtom);
  const hasErrors = useAtomValue(hasErrorsAtom);
  const initializeNodeNamesMap = useSetAtom(initializeNodeNamesMapAtom);

  useEffect(() => {
    if (!hasInitialized && isInitialized) {
      void autoLayoutNodes();
      setHasInitialized(true);
    }
  }, [hasInitialized, isInitialized]);

  const onLoad = async () => {
    const model = await LoadFile();
    const compiledVariables: AnyVariableData[] = [];

    for (const v of model.variables) {
      const result = AnyVariableSchema.safeParse(v);
      if (!result.success) {
        console.error(result.error);
        await ClearModel();
        return;
      }
      compiledVariables.push(result.data);
    }

    const { nodes, edges, nodeNameToId } =
      variablesToNodesAndEdges(compiledVariables);
    setNodes([]);
    setEdges([]);
    setNodes(nodes);
    setEdges(edges);
    initializeNodeNamesMap(nodeNameToId);
    setCompiledModel({ variables: compiledVariables });
    setSimulationResult(null);
    setHasInitialized(false);
  };

  const onSaveAs = async () => {
    await SaveFileAs();
  };

  const onSave = async () => {
    await SaveFile();
  };

  const onSimulate = async () => {
    setSimulationResult(null);
    setIsSimulating(true);
    const results = (await Simulate(
      simSettings.iterations,
      simSettings.steps
    )) as SimulationResult;
    setSimulationResult(results);
    setIsSimulating(false);
  };

  return (
    <div className="flex w-screen justify-start gap-4 border-b-4 bg-neutral-3 px-2 py-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => onLoad()}>Open</MenubarItem>{" "}
            <MenubarItem disabled={hasErrors} onSelect={() => onSave()}>
              Save
            </MenubarItem>
            <MenubarItem onSelect={() => onSaveAs()}>Save As</MenubarItem>
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
              ) : isSimulating ? (
                <div className="absolute right-0 top-0 grid h-4 w-4 translate-x-1/2 place-items-center rounded-full bg-primary-8 p-0.5">
                  <PlayIcon className="h-2.5 w-2.5 fill-neutral-13" />
                </div>
              ) : simulationResult !== null ? (
                <CheckCircleIcon className="absolute right-0 top-0 h-4 w-4 translate-x-1/2 rounded-full bg-primary-8 text-neutral-13" />
              ) : null}
            </Button>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup
              value={simSettings.iterations.toString()}
              onValueChange={(val) =>
                setSimSettings({ ...simSettings, iterations: Number(val) })
              }
            >
              <MenubarLabel>Iterations</MenubarLabel>
              <MenubarRadioItem value="5000">Rough (5,000)</MenubarRadioItem>
              <MenubarRadioItem value="10000">
                Standard (10,000)
              </MenubarRadioItem>
              <MenubarRadioItem value="50000">
                High-fidelity (50,000)
              </MenubarRadioItem>{" "}
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarLabel>Iterations</MenubarLabel>

            <MenubarLabel>
              <Input
                size="md"
                className="font-normal text-sm text-right"
                dir="rtl"
                type="number"
                min={1}
                max={100}
                step={10}
                value={simSettings.steps}
                onChange={(e) =>
                  setSimSettings({
                    ...simSettings,
                    steps: Number(e.target.value),
                  })
                }
              />
            </MenubarLabel>

            <MenubarSeparator />
            <MenubarItem
              disabled={hasErrors || simulationResult !== null}
              onSelect={() => {
                if (!hasErrors) {
                  // void simulate.mutateAsync({
                  //   model: compiledModel,
                  //   iterations: 10000,
                  //   steps: 50,
                  // });
                  onSimulate();
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
