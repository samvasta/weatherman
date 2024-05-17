package variables

import (
	"testing"
)

func TestNewFloor(t *testing.T) {
	variable := NewFloor("result", "a")

	if variable.Type != T_Floor {
		t.Errorf("Expected type=Floor, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Input != "a" {
		t.Errorf("Expected a, got %v", variable.Input)
	}
}

func TestFloor(t *testing.T) {
	inputs := map[string]float64{
		"a": 2.4999,
	}

	variable := NewFloor("result", "a")

	tests := []struct {
		input    float64
		expected float64
	}{
		{2.4999, 2},
		{2.5, 2},
		{2.5001, 2},
		{2.9999, 2},
		{-2.4999, -3},
		{-2.5, -3},
		{-2.5001, -3},
		{-2.9999, -3},
	}

	for _, test := range tests {
		inputs["a"] = test.input

		result := variable.Compute(inputs, 0)

		if result != test.expected {
			t.Errorf("Expected %v, got %v", test.expected, result)
		}
	}
}

func TestNewCeil(t *testing.T) {
	variable := NewCeil("result", "a")

	if variable.Type != T_Ceil {
		t.Errorf("Expected type=Ceil, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Input != "a" {
		t.Errorf("Expected a, got %v", variable.Input)
	}
}

func TestCeil(t *testing.T) {
	inputs := map[string]float64{
		"a": 2.4999,
	}

	variable := NewCeil("result", "a")

	tests := []struct {
		input    float64
		expected float64
	}{
		{2.4999, 3},
		{2.5, 3},
		{2.5001, 3},
		{2.9999, 3},
		{-2.4999, -2},
		{-2.5, -2},
		{-2.5001, -2},
		{-2.9999, -2},
	}

	for _, test := range tests {
		inputs["a"] = test.input

		result := variable.Compute(inputs, 0)

		if result != test.expected {
			t.Errorf("Expected %v, got %v", test.expected, result)
		}
	}
}

func TestNewRound(t *testing.T) {
	variable := NewRound("result", "a")

	if variable.Type != T_Round {
		t.Errorf("Expected type=Round, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Input != "a" {
		t.Errorf("Expected a, got %v", variable.Input)
	}
}

func TestRound(t *testing.T) {
	inputs := map[string]float64{
		"a": 2.4999,
	}

	variable := NewRound("result", "a")

	tests := []struct {
		input    float64
		expected float64
	}{
		{2.4999, 2},
		{2.5, 3},
		{2.5001, 3},
		{2.9999, 3},
		{-2.4999, -2},
		{-2.5, -3},
		{-2.5001, -3},
		{-2.9999, -3},
	}

	for _, test := range tests {
		inputs["a"] = test.input

		result := variable.Compute(inputs, 0)

		if result != test.expected {
			t.Errorf("Expected %v, got %v", test.expected, result)
		}
	}
}
