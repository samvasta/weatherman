package variables

import (
	"testing"
)

func TestNewProduct(t *testing.T) {
	variable := NewProduct("result", []string{"a", "b"})

	if variable.Type != T_Product {
		t.Errorf("Expected type=product, got %v", variable.Type)
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

func TestProduct(t *testing.T) {
	inputs := map[string]float64{
		"a": 16,
		"b": 2.5,
	}

	variable := NewProduct("result", []string{"a", "b"})

	result := variable.Compute(inputs)

	if result != 40 {
		t.Errorf("Expected 40, got %v", result)
	}
}

func TestProduct2(t *testing.T) {
	inputs := map[string]float64{
		"a": -0.1,
		"b": -321,
	}

	variable := NewProduct("result", []string{"a", "b"})

	result := variable.Compute(inputs)

	if result != 32.1 {
		t.Errorf("Expected 32.1, got %v", result)
	}
}
