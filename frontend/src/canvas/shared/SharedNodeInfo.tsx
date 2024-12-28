import { Txt } from "@/components/primitives/text/Text";

import { type CommonVariableInfoData } from "@/types/variables/common";

export function CommonVariableInfo({ info }: { info: CommonVariableInfoData }) {
  return (
    <div className="block">
      <Txt size="md">{info.name}</Txt>
      <Txt
        size="xs"
        intent="subtle"
        className="line-clamp-3 max-w-40 whitespace-pre-wrap"
      >
        {info.description}
      </Txt>
    </div>
  );
}
