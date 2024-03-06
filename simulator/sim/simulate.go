package sim

import (
	"samvasta.com/weatherman/simulator"
	"samvasta.com/weatherman/simulator/variables"
)

type ModelState struct {
	Model *simulator.Model

	Step int

	sortedVariables []variables.Variable

	Results map[string]float64
}

func InitModelState(model *simulator.Model) ModelState {
	state := ModelState{
		Model: model,
		Step:  0,
	}

	state.sortedVariables = TopologicalSort(model.Collectors)

	return state
}

func SimulateOneStep(prevState *ModelState) ModelState {
	inputs := make(map[string]float64)
	collectorValues := make(map[string]float64)

	for _, c := range prevState.Model.Collectors {
		if prevState.Results != nil {
			inputs[c.Target.Name] = prevState.Results[c.Name]
		}
		collectorValues[c.Name] = 0
	}

	for _, v := range prevState.sortedVariables {
		result := v.Compute(inputs)
		inputs[v.GetInfo().Name] = result

		if _, ok := collectorValues[v.GetInfo().Name]; ok {
			collectorValues[v.GetInfo().Name] = result
		}
	}

	return ModelState{
		Model:           prevState.Model,
		Step:            prevState.Step + 1,
		sortedVariables: prevState.sortedVariables,
		Results:         collectorValues,
	}
}

func Simulate(model *simulator.Model, steps int) []ModelState {
	state := InitModelState(model)

	states := make([]ModelState, steps+1)
	states[0] = state

	for i := 0; i < steps; i++ {
		state = SimulateOneStep(&state)
		states = append(states, state)
	}

	return states
}

type MonteCarloResult struct {
	Steps []ModelState
}

func MonteCarlo(model *simulator.Model, steps int, iterations int) []MonteCarloResult {
	runs := make([]MonteCarloResult, iterations)

	for i := 0; i < iterations; i++ {
		runs[i] = MonteCarloResult{Steps: Simulate(model, steps)}
	}

	return runs
}
