package variables

import (
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
)

func TestDivide(t *testing.T) {
	inputs := map[string]float64{
		"quotient": 10,
		"divisor":  2,
	}

	quotient := IVar{
		VariableInfo: VariableInfo{Name: "quotient"},
		Distribution: distributions.Constant{Value: 10},
	}
	divisor := IVar{
		VariableInfo: VariableInfo{Name: "divisor"},
		Distribution: distributions.Constant{Value: 2},
	}

	variable := Divide{
		VariableInfo: VariableInfo{Name: "result"},
		Quotient:     quotient,
		Divisor:      divisor,
	}

	result := variable.Compute(inputs)

	if result != 5 {
		t.Errorf("Expected 5, got %v", result)
	}
}
