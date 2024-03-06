package variables

import (
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
)

func TestSum(t *testing.T) {
	inputs := map[string]float64{
		"a": 16,
		"b": 2.5,
	}

	a := IVar{
		VariableInfo: VariableInfo{Name: "a"},
		Distribution: distributions.Constant{Value: 16},
	}
	b := IVar{
		VariableInfo: VariableInfo{Name: "b"},
		Distribution: distributions.Constant{Value: 2.5},
	}

	variable := Sum{
		VariableInfo: VariableInfo{Name: "result"},
		Variables:    []Variable{a, b},
	}

	result := variable.Compute(inputs)

	if result != 18.5 {
		t.Errorf("Expected 18.5, got %v", result)
	}
}

func TestSum2(t *testing.T) {
	inputs := map[string]float64{
		"a": 0.1,
		"b": 321,
	}

	a := IVar{
		VariableInfo: VariableInfo{Name: "a"},
		Distribution: distributions.Constant{Value: 0.1},
	}
	b := IVar{
		VariableInfo: VariableInfo{Name: "b"},
		Distribution: distributions.Constant{Value: 321},
	}

	variable := Sum{
		VariableInfo: VariableInfo{Name: "result"},
		Variables:    []Variable{a, b},
	}

	result := variable.Compute(inputs)

	if result != 321.1 {
		t.Errorf("Expected 321.1, got %v", result)
	}
}
