import { type PowerData } from "@/types/variables";

import { CommonVariableInfo } from "./SharedNodeInfo";

export function PowerNode({ data }: { data: PowerData }) {
  return (
    <>
      <CommonVariableInfo info={data} />
    </>
  );
}
