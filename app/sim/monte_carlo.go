package sim

import (
	"runtime"
	"time"

	"samvasta.com/weatherman/app/shared"
)

type MonteCarloIterationResult struct {
	Steps    []ModelState
	Duration time.Duration
}

type MonteCarloResult struct {
	Iterations []MonteCarloIterationResult
}

func worker(model *shared.Model, jobs chan int, results chan MonteCarloIterationResult) {

	for numSteps := range jobs {
		start := time.Now()
		simulatedSteps := Simulate(model, numSteps)
		duration := time.Since(start)
		result := MonteCarloIterationResult{Steps: simulatedSteps, Duration: duration}
		results <- result
	}
}

func MonteCarlo(model *shared.Model, steps int, iterations int) MonteCarloResult {
	runs := make([]MonteCarloIterationResult, iterations)

	jobsChan := make(chan int, iterations)
	resultChan := make(chan MonteCarloIterationResult, iterations)

	numWorkers := min(iterations, runtime.NumCPU())

	for i := 0; i < numWorkers; i++ {
		go worker(model, jobsChan, resultChan)
	}

	for i := 0; i < iterations; i++ {
		jobsChan <- steps
	}

	received := 0

	for result := range resultChan {
		runs[received] = result
		received++

		if received == iterations {
			close(jobsChan)
			close(resultChan)
		}
	}

	return MonteCarloResult{Iterations: runs}
}
