import { Model } from "@/types/model";
import { AnyVariableData } from "@/types/variables/allVariables";

export const CURRENT_VERSION = 1;

export function migrate(input: Record<string, unknown>) {
  let output = { ...input };
  let version = 0;
  if (!("meta" in input)) {
    version = 0;
  }

  if (version === 0) {
    output = {
      ...input,
      meta: {
        version: 1,
      },
      steps: 50,
      iterations: 5_000,
    };

    for (const variable of output.variables as AnyVariableData[]) {
      variable.ui.isOutputFloating = false;
    }

    version = 1;
  }

  return output as Model;
}
