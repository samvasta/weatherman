import { type SumData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function SumNode({ data }: { data: SumData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
