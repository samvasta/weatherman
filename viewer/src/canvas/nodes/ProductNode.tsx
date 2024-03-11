import { X } from "lucide-react";

import { type ProductData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";
import { WithLeftNodeIcon } from "./WithLeftNodeIcon";

export function ProductNode({ data }: { data: ProductData }) {
  return (
    <WithLeftNodeIcon IconComponent={X}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}
