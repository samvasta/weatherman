package sim

import (
	"slices"
)

type Percentiles struct {
	P00  float64 `json:"p00"`
	P05  float64 `json:"p05"`
	P10  float64 `json:"p10"`
	P25  float64 `json:"p25"`
	P50  float64 `json:"p50"`
	P75  float64 `json:"p75"`
	P90  float64 `json:"p90"`
	P95  float64 `json:"p95"`
	P100 float64 `json:"p100"`
}

func (p Percentiles) Range() float64 {
	return p.P100 - p.P00
}

func NewPercentiles(samples []float64) Percentiles {

	sorted := make([]float64, len(samples))

	copy(sorted, samples)
	slices.Sort(sorted)

	return Percentiles{
		P00:  sorted[0],
		P05:  sorted[len(samples)*5/100],
		P10:  sorted[len(samples)*10/100],
		P25:  sorted[len(samples)*25/100],
		P50:  sorted[len(samples)*50/100],
		P75:  sorted[len(samples)*75/100],
		P90:  sorted[len(samples)*90/100],
		P95:  sorted[len(samples)*95/100],
		P100: sorted[len(samples)-1],
	}
}

type CollectorStepStats struct {
	Percentiles
}

type Serie []float64

type CollectorStats struct {
	Steps           []CollectorStepStats `json:"steps"`
	IterationValues []Serie              `json:"iterationSeries"`
}

func (result MonteCarloResult) GetStats(collectorName string) CollectorStats {
	iterationValues := make([]Serie, len(result.Iterations))
	stepResults := make([][]float64, len(result.Iterations[0].Steps))

	for iterationNum, iter := range result.Iterations {
		for i, step := range iter.Steps {
			stepResults[i] = append(stepResults[i], step.Results[collectorName])
		}

		values := make([]float64, len(iter.Steps))
		for i, step := range iter.Steps {
			values[i] = step.Results[collectorName]
		}

		iterationValues[iterationNum] = Serie(values)
	}

	steps := make([]CollectorStepStats, len(stepResults))

	for i, step := range stepResults {
		steps[i] = CollectorStepStats{NewPercentiles(step)}
	}

	return CollectorStats{Steps: steps, IterationValues: []Serie{}}

}
