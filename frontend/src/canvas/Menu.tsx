import React, { type ChangeEvent, useEffect } from "react";

import { useNodesInitialized, useReactFlow } from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CheckCircleIcon, PlayIcon, TriangleAlertIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/primitives/button/Button";
import { Dialog } from "@/components/primitives/floating/dialog/Dialog";
import { Tooltip } from "@/components/primitives/floating/tooltip/Tooltip";
import { Input, NumberInput } from "@/components/primitives/input/Input";
import { Label } from "@/components/primitives/label/Label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/primitives/menubar/Menubar";

import {
  ListRecentModels,
  LoadModel,
  Login,
  Logout,
  SaveModel,
  SaveModelAs,
  Simulate,
  getAuthModel,
} from "@/io/serverFns";
import { migrate } from "@/serialize/migrate";
import { authAtom, isLoggedInAtom } from "@/state/auth.atoms";
import {
  getCompiledModelAtom,
  initializeNodeNamesMapAtom,
  makeEmptyModel,
  setCompiledModelAtom,
} from "@/state/model.atoms";
import { simulationResultAtom } from "@/state/simulationResults.atoms";
import { hasErrorsAtom } from "@/state/validation.atoms";
import { type Model, type ModelFileInfo } from "@/types/model";
import { type AnyVariableData } from "@/types/variables/allVariables";

import useLayoutNodes from "./useLayoutNodes";
import { variablesToNodesAndEdges } from "./useNodesAndEdges";

export function Menu() {
  const [modelId, setModelId] = useQueryState("model");

  const autoLayoutNodes = useLayoutNodes();

  const { setNodes, setEdges } = useReactFlow();

  const [auth, setAuth] = useAtom(authAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  const isInitialized = useNodesInitialized();
  const [hasInitialized, setHasInitialized] = React.useState(isInitialized);

  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationResult, setSimulationResult] = useAtom(simulationResultAtom);

  const compiledModel = useAtomValue(getCompiledModelAtom);
  const setCompiledModel = useSetAtom(setCompiledModelAtom);
  const hasErrors = useAtomValue(hasErrorsAtom);
  const initializeNodeNamesMap = useSetAtom(initializeNodeNamesMapAtom);

  const [recentModels, setRecentModels] = React.useState<ModelFileInfo[]>([]);
  useEffect(() => {
    const loadRecentModels = async () => {
      setRecentModels(await ListRecentModels());
    };

    if (isLoggedIn) {
      loadRecentModels();
    }
  }, [auth, isLoggedIn]);

  const onLoad = async (modelId: string) => {
    const model = await LoadModel(modelId);
    document.title = model.name;
    setModelId(model.id);

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

  const onSave = async () => {
    setCompiledModel(await SaveModel(compiledModel.id, compiledModel));
  };
  const setAndSave = async (model: Partial<Model>) => {
    setCompiledModel(
      await SaveModel(compiledModel.id, { ...compiledModel, ...model })
    );
  };

  const onClearModel = () => {
    setCompiledModel(makeEmptyModel());
  };

  const onSimulate = async () => {
    setSimulationResult(null);
    setIsSimulating(true);
    await onSave();
    const results = await Simulate(compiledModel.id);
    setSimulationResult(results);
    setIsSimulating(false);
  };

  const onLogout = () => {
    Logout();
    setAuth(null);
  };

  useEffect(() => {
    if (modelId && modelId !== compiledModel.id) {
      onLoad(modelId);
    }
  }, [modelId, onLoad, compiledModel.id]);

  return (
    <div className="flex w-screen justify-start gap-4 border-b-4 bg-neutral-3 px-2 py-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>User</MenubarTrigger>
          {isLoggedIn ? (
            <MenubarContent>
              <MenubarItem onSelect={() => onLogout()}>Logout</MenubarItem>
            </MenubarContent>
          ) : (
            <MenubarContent>
              <LoginModal />
            </MenubarContent>
          )}
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger disabled={!isLoggedIn}>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => onClearModel()}>New Model</MenubarItem>

            <MenubarSeparator />

            <MenubarItem disabled={!compiledModel.id} onSelect={() => onSave()}>
              Save
            </MenubarItem>
            <SaveAsModal />

            <MenubarSeparator />

            {recentModels && recentModels.length > 0 && (
              <>
                <MenubarLabel>Recent Models</MenubarLabel>
                {recentModels.map((model) => (
                  <MenubarItem onSelect={() => onLoad(model.id)} key={model.id}>
                    {model.name}
                  </MenubarItem>
                ))}
              </>
            )}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger disabled={!isLoggedIn || !compiledModel.id}>
            Model
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => autoLayoutNodes()}>
              Auto-layout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger disabled={!isLoggedIn || !compiledModel.id} asChild>
            <Button variant="link" size="sm" className="text-neutral-12">
              Simulate
              {simulationResult === null && hasErrors ? (
                <Tooltip
                  content="Cannot simulate because the model has errors."
                  colorScheme="danger"
                >
                  <TriangleAlertIcon className="h-4 w-4 -translate-y-0.5 fill-danger-9 text-neutral-12" />
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
              onValueChange={(val) => setAndSave({ iterations: Number(val) })}
            >
              <MenubarLabel>Iterations</MenubarLabel>
              <MenubarRadioItem value="1">Debug (1)</MenubarRadioItem>
              <MenubarRadioItem value="500">Testing (500)</MenubarRadioItem>
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
                className="text-right text-sm font-normal"
                dir="rtl"
                min={1}
                max={100}
                step={10}
                value={compiledModel.steps}
                onChange={(value: number) => setAndSave({ steps: value })}
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

function LoginModal() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [auth, setAuth] = useAtom(authAtom);

  const onLogin = async (onClose: () => void) => {
    const res = await Login(email, password);
    const authModel = getAuthModel();
    setAuth(authModel);
    if (authModel) {
      onClose();
    }
  };

  return (
    <Dialog
      content={({ onClose }) => (
        <form
          onSubmit={(e) => {
            onLogin(onClose);
            e.preventDefault();
          }}
        >
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            value={password}
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            colorScheme="primary"
            className="mt-comfortable"
          >
            Login
          </Button>
        </form>
      )}
    >
      <Button variant="ghost">Login</Button>
    </Dialog>
  );
}

function SaveAsModal() {
  const [modelId, setModelId] = useQueryState("model");
  const [name, setName] = React.useState("");
  const compiledModel = useAtomValue(getCompiledModelAtom);
  const setCompiledModel = useSetAtom(setCompiledModelAtom);

  const onSave = async (onClose: () => void) => {
    const res = await SaveModelAs(name, compiledModel);

    setCompiledModel(res);
    document.title = name;
    setModelId(res.id);
    onClose();
  };

  return (
    <Dialog
      content={({ onClose }) => (
        <form
          onSubmit={(e) => {
            onSave(onClose);
            e.preventDefault();
          }}
        >
          <Label htmlFor="save-name">Name</Label>
          <Input
            id="save-name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />

          <Button
            type="submit"
            colorScheme="primary"
            className="mt-comfortable"
          >
            Save
          </Button>
        </form>
      )}
    >
      <Button
        variant="ghost"
        className="flex w-full justify-start rounded-sm px-2 text-sm font-normal hover:bg-primary-4"
      >
        Save As
      </Button>
    </Dialog>
  );
}
