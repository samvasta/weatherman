package sim

import (
	"slices"
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/shared"
	"samvasta.com/weatherman/simulator/variables"
)

func TestMonteCarlo(t *testing.T) {
	model := shared.NewModel()

	initialPrinciple := variables.NewIVar("initialPrinciple", distributions.NewConstant(1000))

	contribution := variables.NewIVar("contribution", distributions.NewConstant(100))

	returnOnInvestment := variables.NewIVar("returnOnInvestment", distributions.NewNormal(0.1, 0.05))

	totalPrinciple := variables.NewSum("totalPrinciple", []string{"initialPrinciple", "contribution"})

	const1 := variables.NewIVar("const1", distributions.NewConstant(1))

	roiMultiplier := variables.NewSum("roiMultiplier", []string{"returnOnInvestment", "const1"})

	finalValue := variables.NewProduct("finalValue", []string{"totalPrinciple", "roiMultiplier"})

	collector := variables.NewCollector("collector", "finalValue")
	collector.Target = "initialPrinciple"

	model.AddVariable(initialPrinciple)
	model.AddVariable(contribution)
	model.AddVariable(returnOnInvestment)
	model.AddVariable(totalPrinciple)
	model.AddVariable(const1)
	model.AddVariable(roiMultiplier)
	model.AddVariable(finalValue)
	model.AddVariable(collector)

	result := MonteCarlo(&model, 10, 10000)

	finalValues := make([]float64, len(result.Iterations))
	for i, run := range result.Iterations {
		finalStep := run.Steps[len(run.Steps)-1]
		finalValues[i] = finalStep.Results["collector"]
	}

	slices.Sort(finalValues)
	median := finalValues[len(finalValues)/2]

	if median < 4290 || median > 4410 {
		t.Errorf("Median final value should be about 4347 but got Median=%v", median)
	}
}
