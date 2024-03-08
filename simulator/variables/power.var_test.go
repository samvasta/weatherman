package variables

import (
	"testing"
)

func TestNewPower(t *testing.T) {
	variable := NewPower("result", "base", "exponent")

	if variable.Type != T_Power {
		t.Errorf("Expected type=power, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Base != "base" {
		t.Errorf("Expected base, got %v", variable.Base)
	}

	if variable.Exponent != "exponent" {
		t.Errorf("Expected exponent, got %v", variable.Exponent)
	}
}

func TestPower(t *testing.T) {
	inputs := map[string]float64{
		"base": 10,
		"exp":  2,
	}
	variable := NewPower("result", "base", "exp")

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

	variable := NewPower("result", "base", "exp")

	result := variable.Compute(inputs)

	if result != 0.01 {
		t.Errorf("Expected 0.01, got %v", result)
	}
}
