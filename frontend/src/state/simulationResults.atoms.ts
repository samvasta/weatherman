import { atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";

import { type CollectorStats, type SimulationResult } from "@/types/results";

export const simulationResultAtom = atom<SimulationResult | null>(null);

export const isSimulatedAtom = selectAtom(
  simulationResultAtom,
  (result) => result !== null
);

export function useSimulationResultForNode(
  nodeName: string
): CollectorStats | null {
  const results = useAtomValue(simulationResultAtom);

  return results?.[nodeName] ?? null;
}
