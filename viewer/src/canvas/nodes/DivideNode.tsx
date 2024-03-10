import { type DivideData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function DivideNode({ data }: { data: DivideData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
