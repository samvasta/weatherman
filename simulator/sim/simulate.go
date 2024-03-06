package sim

import (
	"samvasta.com/weatherman/simulator"
	"samvasta.com/weatherman/simulator/variables"
)

type ModelState struct {
	Model *simulator.Model

	PrevState *ModelState

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
	if prevState.Results != nil {
		for _, c := range prevState.Model.Collectors {
			inputs[c.Target.Name] = prevState.Results[c.Name]
		}
	}

	nextResults := make(map[string]float64)
	for _, v := range prevState.sortedVariables {
		result := v.Compute(inputs)
		inputs[v.GetInfo().Name] = result
		nextResults[v.GetInfo().Name] = result
	}

	return ModelState{
		Model:           prevState.Model,
		PrevState:       prevState,
		Step:            prevState.Step + 1,
		sortedVariables: prevState.sortedVariables,
		Results:         nextResults,
	}
}
