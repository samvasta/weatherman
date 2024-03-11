import { LineChart } from "lucide-react";

import { type CollectorData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function CollectorNode({ data }: { data: CollectorData }) {
  return (
    <WithLeftNodeIcon IconComponent={LineChart}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
