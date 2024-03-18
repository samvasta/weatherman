import { Txt } from "@/components/primitives/text/Text";

import { type CommonVariableInfoData } from "@/types/variables/common";

export function CommonVariableInfo({ info }: { info: CommonVariableInfoData }) {
  return (
    <div className="flex">
      <Txt size="md" intent="default">
        {info.name}
      </Txt>
      <Txt size="md" intent="subtle">
        {info.description}
      </Txt>
    </div>
  );
}
