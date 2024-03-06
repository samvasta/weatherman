package variables

import (
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
)

func TestInvert(t *testing.T) {
	inputs := map[string]float64{
		"source": 10,
	}

	source := IVar{
		VariableInfo: VariableInfo{Name: "source"},
		Distribution: distributions.Constant{Value: 10},
	}

	variable := Invert{
		VariableInfo: VariableInfo{Name: "result"},
		input:        source,
	}

	result := variable.Compute(inputs)

	if result != -10 {
		t.Errorf("Expected -10, got %v", result)
	}
}

func TestInvert2(t *testing.T) {
	inputs := map[string]float64{
		"source": -10,
	}

	source := IVar{
		VariableInfo: VariableInfo{Name: "source"},
		Distribution: distributions.Constant{Value: -10},
	}

	variable := Invert{
		VariableInfo: VariableInfo{Name: "result"},
		input:        source,
	}

	result := variable.Compute(inputs)

	if result != 10 {
		t.Errorf("Expected -10, got %v", result)
	}
}
