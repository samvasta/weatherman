package sim

import (
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/variables"
)

type ModelState struct {
	Model *shared.Model

	Step int

	sortedVariables []variables.Variable

	Results map[string]float64
}

func InitModelState(model *shared.Model) ModelState {
	state := ModelState{
		Model: model,
		Step:  0,
	}

	state.sortedVariables = TopologicalSort(model.AllCollectors(), shared.GetVariablesMap(model.AllVariables))

	return state
}

func SimulateOneStep(prevState *ModelState) ModelState {
	inputs := make(map[string]float64)
	collectorValues := make(map[string]float64)

	for _, c := range prevState.Model.AllCollectors() {
		if prevState.Results != nil && c.Target != "" {
			inputs[c.Target] = prevState.Results[c.Name]
		}
		collectorValues[c.Name] = 0
	}

	for _, v := range prevState.sortedVariables {
		result := v.Compute(inputs, prevState.Step+1)
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

func Simulate(model *shared.Model, steps int) []ModelState {
	state := InitModelState(model)

	states := make([]ModelState, steps)
	// states[0] = state

	for i := 0; i < steps; i++ {
		state = SimulateOneStep(&state)
		states[i] = state
	}
	return states
}
