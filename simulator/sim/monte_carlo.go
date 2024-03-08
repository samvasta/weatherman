package sim

import (
	"samvasta.com/weatherman/simulator/shared"
)

type MonteCarloIterationResult struct {
	Steps []ModelState
}

type MonteCarloResult struct {
	Iterations []MonteCarloIterationResult
}

func MonteCarlo(model *shared.Model, steps int, iterations int) MonteCarloResult {
	runs := make([]MonteCarloIterationResult, iterations)

	for i := 0; i < iterations; i++ {
		runs[i] = MonteCarloIterationResult{Steps: Simulate(model, steps)}
	}

	return MonteCarloResult{Iterations: runs}
}
