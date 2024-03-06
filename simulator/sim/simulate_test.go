package sim

import (
	"slices"
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
		state = SimulateOneStep(&state)
		result := state.Results["collector"]
		t.Logf("Step %v, results=%v", i+1, state.Results)

		if result != float64(i+2) {
			t.Errorf("Expected %v, got %v", i+2, result)
		}
	}
}

func TestMonteCarlo(t *testing.T) {
	model := simulator.NewModel()

	initialPrinciple := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "principle",
		},
		Distribution: distributions.Constant{Value: 1000},
	}

	contribution := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "contribution",
		},
		Distribution: distributions.Constant{Value: 100},
	}

	returnOnInvestment := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "returnOnInvestment",
		},
		Distribution: distributions.Normal{
			Mean:   0.1,
			StdDev: 0.05,
		},
	}

	totalPrinciple := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "totalPrinciple",
		},
		Variables: []variables.Variable{initialPrinciple, contribution},
	}

	const1 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "const1",
		},
		Distribution: distributions.Constant{Value: 1},
	}

	roiMultiplier := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "roiMultiplier",
		},
		Variables: []variables.Variable{returnOnInvestment, const1},
	}

	finalValue := variables.Product{
		VariableInfo: variables.VariableInfo{
			Name: "result",
		},
		Variables: []variables.Variable{totalPrinciple, roiMultiplier},
	}

	collector := variables.Collector{
		VariableInfo: variables.VariableInfo{
			Name: "collector",
		},
		Input:  finalValue,
		Target: &initialPrinciple,
	}

	model.AddCollector(collector)

	runs := MonteCarlo(&model, 10, 10000)

	finalValues := make([]float64, len(runs))
	for i, run := range runs {
		finalStep := run.Steps[len(run.Steps)-1]
		finalValues[i] = finalStep.Results["collector"]
		t.Logf("Run %v: %v", i, finalStep.Results["collector"])
	}

	slices.Sort(finalValues)
	median := finalValues[len(finalValues)/2]

	if median < 4300 || median > 4400 {
		t.Errorf("Median final value should be about 4347 but got Median=%v", median)
	}
}
