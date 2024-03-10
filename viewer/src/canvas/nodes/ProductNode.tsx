import { type ProductData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function ProductNode({ data }: { data: ProductData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
