import { useSetAtom } from "jotai";
import { useUpdateNodeInternals } from "@xyflow/react";

import { Checkbox } from "@/components/primitives/checkbox/Checkbox";
import { Input, Textarea } from "@/components/primitives/input/Input";
import { Label } from "@/components/primitives/label/Label";
import { Heading } from "@/components/primitives/text/Heading";

import { AllVariables } from "@/types/variables/allVariables";
import {
  type CommonVariableInfoData,
  type VariablePropertiesProps,
} from "@/types/variables/common";

import { updateNodeNameAtom } from "../atoms";

export function WithCommonProperties<T extends CommonVariableInfoData>({
  data,
  onChange,
  children,
}: React.PropsWithChildren<VariablePropertiesProps<T>>) {
  const updateNodeName = useSetAtom(updateNodeNameAtom);
  const updateNodeInternals = useUpdateNodeInternals();

  const hasOutput = AllVariables[data.type].hasOutput;

  return (
    <div className="flex w-full flex-col gap-comfortable">
      <div className="flex flex-col gap-2">
        <div>
          <Heading size="sm">Name</Heading>
          <Input
            size="sm"
            value={data.name}
            onChange={(e) => {
              updateNodeName({ id: data.ui.id, name: e.target.value });
              onChange({ name: e.target.value } as Partial<T>);
            }}
          />
        </div>

        <div>
          <Heading size="sm">Description</Heading>
          <Textarea
            size="sm"
            value={data.description}
            onChange={(e) =>
              onChange({ description: e.target.value } as Partial<T>)
            }
          />
        </div>

        {hasOutput && (
          <div>
            <Heading size="sm">Connections</Heading>
            <div className="flex items-center gap-2">
              <Checkbox
                id="magic-link"
                colorScheme="primary"
                checked={data.ui.isOutputFloating ?? false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...data,
                    ui: { ...data.ui, isOutputFloating: checked },
                  });
                  updateNodeInternals(data.ui.id);
                }}
              />
              <Label htmlFor="magic-link">Magic Connection Line</Label>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
