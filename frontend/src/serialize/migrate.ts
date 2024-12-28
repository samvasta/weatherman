import { type Model } from "@/types/model";

export const CURRENT_VERSION = 1;

export function migrate(input: Record<string, unknown>): Model {
  let output = { ...input };
  let version = 0;
  if ("schemaVersion" in input) {
    version = (input as { schemaVersion: number }).schemaVersion;
  }

  if (version === 0) {
    output = {
      ...input,
      schemaVersion: 1,
      steps: 50,
      iterations: 5_000,
    };

    version = 1;
  }

  return output as Model;
}
