import { Superscript } from "lucide-react";

import { type PowerData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function PowerNode({ data }: { data: PowerData }) {
  return (
    <WithLeftNodeIcon IconComponent={Superscript}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
