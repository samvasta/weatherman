import { useSetAtom } from "jotai";

import { Input, Textarea } from "@/components/primitives/input/Input";
import { Heading } from "@/components/primitives/text/Heading";

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
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
