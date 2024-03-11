import { Plus } from "lucide-react";

import { type SumData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function SumNode({ data }: { data: SumData }) {
  return (
    <WithLeftNodeIcon IconComponent={Plus}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
