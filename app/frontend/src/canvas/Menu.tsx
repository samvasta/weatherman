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
import { Input, NumberInput } from "@/components/primitives/input/Input";
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
import { VariableNodeType, variablesToNodesAndEdges } from "./useNodesAndEdges";
import {
  LoadFile,
  SaveFile,
  SaveFileAs,
  ClearModel,
  Simulate,
  OnModelUpdated,
} from "~/go/main/App";
import {
  AnyVariableData,
  AnyVariableSchema,
  SafeAnyVariableSchema,
} from "@/types/variables/allVariables";
import { SimulationResult } from "@/types/results";
import { migrate } from "@/serialize/migrate";

export function Menu() {
  const autoLayoutNodes = useLayoutNodes();

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const isInitialized = useNodesInitialized();
  const [hasInitialized, setHasInitialized] = React.useState(isInitialized);

  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationResult, setSimulationResult] = useAtom(simulationResultAtom);

  const compiledModel = useAtomValue(getCompiledModelAtom);
  const setCompiledModel = useSetAtom(setCompiledModelAtom);
  const hasErrors = useAtomValue(hasErrorsAtom);
  const initializeNodeNamesMap = useSetAtom(initializeNodeNamesMapAtom);

  const onLoad = async () => {
    const model = await LoadFile();

    const compiledVariables: AnyVariableData[] = [];

    let modelHasPositions = true;
    for (const v of model.variables) {
      compiledVariables.push(v);
      if (modelHasPositions && v.ui?.id === "") {
        modelHasPositions = false;
      }
    }

    const migratedModel = migrate({ ...model, variables: compiledVariables });

    const { nodes, edges, nodeNameToId } = variablesToNodesAndEdges(
      migratedModel.variables
    );

    setNodes([]);
    setEdges([]);
    setNodes(nodes);
    setEdges(edges);
    initializeNodeNamesMap(nodeNameToId);
    setCompiledModel(migratedModel);
    setSimulationResult(null);
    setHasInitialized(!modelHasPositions);
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
    const results = (await Simulate()) as SimulationResult;
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
              value={compiledModel.iterations.toString()}
              onValueChange={(val) =>
                setCompiledModel({ iterations: Number(val) })
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
              <NumberInput
                size="md"
                className="font-normal text-sm text-right"
                dir="rtl"
                min={1}
                max={100}
                step={10}
                value={compiledModel.steps}
                onChange={(value) => setCompiledModel({ steps: value })}
              />
            </MenubarLabel>

            <MenubarSeparator />
            <MenubarItem
              disabled={hasErrors || simulationResult !== null}
              onSelect={() => {
                if (!hasErrors) {
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
