import { Divide } from "lucide-react";

import { type DivideData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function DivideNode({ data }: { data: DivideData }) {
  return (
    <WithLeftNodeIcon IconComponent={Divide}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
