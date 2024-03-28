package sim

import (
	"testing"

	"samvasta.com/weatherman/app/distributions"
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/variables"
)

func TestSimulateMultiStep(t *testing.T) {
	model := shared.NewModel()

	a1 := variables.NewIVar("A1", distributions.NewConstant(1))

	a2 := variables.NewIVar("A2", distributions.NewConstant(1))

	result := variables.NewSum("result", []string{"A1", "A2"})

	collector := variables.NewCollector("collector", "result")
	collector.Target = "A1"

	model.AddVariable(a1)
	model.AddVariable(a2)
	model.AddVariable(result)
	model.AddVariable(collector)

	state := InitModelState(&model)

	for i := 0; i < 10; i++ {
		state = SimulateOneStep(&state)
		result := state.Results["collector"]
		t.Logf("Step %v, results=%v", i+1, state.Results)

		if result != float64(i+2) {
			t.Errorf("Expected %v, got %v", i+2, result)
		}
	}
}
