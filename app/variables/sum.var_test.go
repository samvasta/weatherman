package variables

import (
	"testing"
)

func TestNewSum(t *testing.T) {
	variable := NewSum("result", []string{"a", "b"})

	if variable.Type != T_Sum {
		t.Errorf("Expected type=sum, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Inputs[0] != "a" {
		t.Errorf("Expected a, got %v", variable.Inputs[0])
	}

	if variable.Inputs[1] != "b" {
		t.Errorf("Expected b, got %v", variable.Inputs[1])
	}
}

func TestSum(t *testing.T) {
	inputs := map[string]float64{
		"a": 16,
		"b": 2.5,
	}

	variable := NewSum("result", []string{"a", "b"})

	result := variable.Compute(inputs, 0)

	if result != 18.5 {
		t.Errorf("Expected 18.5, got %v", result)
	}
}

func TestSum2(t *testing.T) {
	inputs := map[string]float64{
		"a": 0.1,
		"b": 321,
	}

	variable := NewSum("result", []string{"a", "b"})

	result := variable.Compute(inputs, 0)

	if result != 321.1 {
		t.Errorf("Expected 321.1, got %v", result)
	}
}
