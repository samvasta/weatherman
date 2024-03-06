package sim

import (
	"testing"

	"samvasta.com/weatherman/simulator"
	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/variables"
)

func TestSimulateMultiStep(t *testing.T) {
	model := simulator.NewModel()

	a1 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "A1",
		},
		Distribution: distributions.Constant{Value: 1},
	}

	a2 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "A2",
		},
		Distribution: distributions.Constant{Value: 1},
	}

	result := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "result",
		},
		Variables: []variables.Variable{a1, a2},
	}

	collector := variables.Collector{
		VariableInfo: variables.VariableInfo{
			Name: "collector",
		},
		Input:  result,
		Target: &a1,
	}

	model.AddCollector(collector)

	state := InitModelState(&model)

	for i := 0; i < 10; i++ {
		t.Logf("Step %v, results=%v", i+1, state.Results)
		state = SimulateOneStep(&state)
		result := state.Results["collector"]

		if result != float64(i+2) {
			t.Errorf("Expected %v, got %v", i+2, result)
		}
	}

}
