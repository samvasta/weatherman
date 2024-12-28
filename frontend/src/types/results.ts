export type Percentiles = {
  p00: number;
  p05: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p100: number;
};

export type CollectorStepStats = Percentiles & {};

export type Serie = number[];

export type CollectorStats = {
  steps: CollectorStepStats[];
  iterationSeries: Serie[];
};

export type SimulationResult = {
  [variableName: string]: CollectorStats;
};
