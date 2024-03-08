package sim

import "slices"

type Percentiles struct {
	P00  float64
	P05  float64
	P10  float64
	P25  float64
	P50  float64
	P75  float64
	P90  float64
	P95  float64
	P100 float64
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
	Steps           []CollectorStepStats
	IterationValues []Serie
}

func (result MonteCarloResult) GetStats(collectorName string) CollectorStats {

	iterationValues := make([]Serie, len(result.Iterations))
	stepResults := make([][]float64, len(result.Iterations[0].Steps))

	for _, iter := range result.Iterations {
		for i, step := range iter.Steps {
			stepResults[i] = append(stepResults[i], step.Results[collectorName])
		}

		values := make([]float64, len(iter.Steps))
		for i, step := range iter.Steps {
			values[i] = step.Results[collectorName]
		}

		iterationValues = append(iterationValues, Serie(values))
	}

	steps := make([]CollectorStepStats, len(stepResults))

	for i, step := range stepResults {
		steps[i] = CollectorStepStats{NewPercentiles(step)}
	}

	return CollectorStats{Steps: steps, IterationValues: iterationValues}

}
