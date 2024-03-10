import { type CollectorData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function CollectorNode({ data }: { data: CollectorData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
