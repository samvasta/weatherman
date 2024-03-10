import { type InvertData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function InvertNode({ data }: { data: InvertData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
