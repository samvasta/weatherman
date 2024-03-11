import { ArrowDownUp } from "lucide-react";

import { type InvertData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function InvertNode({ data }: { data: InvertData }) {
  return (
    <WithLeftNodeIcon IconComponent={ArrowDownUp}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
