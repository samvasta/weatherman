package variables

import (
	"testing"
)

func TestNewDivide(t *testing.T) {
	variable := NewDivide("result", "dividend", "divisor")

	if variable.Type != T_Divide {
		t.Errorf("Expected type=divide, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Dividend != "dividend" {
		t.Errorf("Expected dividend, got %v", variable.Dividend)
	}

	if variable.Divisor != "divisor" {
		t.Errorf("Expected divisor, got %v", variable.Divisor)
	}
}

func TestDivide(t *testing.T) {
	inputs := map[string]float64{
		"dividend": 10,
		"divisor":  2,
	}

	variable := NewDivide("result", "dividend", "divisor")

	result := variable.Compute(inputs, 0)

	if result != 5 {
		t.Errorf("Expected 5, got %v", result)
	}
}
