package variables

import (
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
)

func TestPower(t *testing.T) {
	inputs := map[string]float64{
		"base": 10,
		"exp":  2,
	}

	base := IVar{
		VariableInfo: VariableInfo{Name: "base"},
		Distribution: distributions.Constant{Value: 10},
	}
	exp := IVar{
		VariableInfo: VariableInfo{Name: "exp"},
		Distribution: distributions.Constant{Value: 2},
	}

	variable := Power{
		VariableInfo: VariableInfo{Name: "result"},
		Base:         base,
		Exponent:     exp,
	}

	result := variable.Compute(inputs)

	if result != 100 {
		t.Errorf("Expected 100, got %v", result)
	}
}

func TestPower2(t *testing.T) {
	inputs := map[string]float64{
		"base": 10,
		"exp":  -2,
	}

	base := IVar{
		VariableInfo: VariableInfo{Name: "base"},
		Distribution: distributions.Constant{Value: 10},
	}
	exp := IVar{
		VariableInfo: VariableInfo{Name: "exp"},
		Distribution: distributions.Constant{Value: -2},
	}

	variable := Power{
		VariableInfo: VariableInfo{Name: "result"},
		Base:         base,
		Exponent:     exp,
	}

	result := variable.Compute(inputs)

	if result != 0.01 {
		t.Errorf("Expected 0.01, got %v", result)
	}
}
