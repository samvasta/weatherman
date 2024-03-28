package variables

import (
	"testing"
)

func TestNewInvert(t *testing.T) {
	variable := NewInvert("result", "input")

	if variable.Type != T_Invert {
		t.Errorf("Expected type=invert, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.Input != "input" {
		t.Errorf("Expected input, got %v", variable.Input)
	}

}

func TestInvert(t *testing.T) {
	inputs := map[string]float64{
		"source": 10,
	}

	variable := NewInvert("result", "source")

	result := variable.Compute(inputs)

	if result != -10 {
		t.Errorf("Expected -10, got %v", result)
	}
}

func TestInvert2(t *testing.T) {
	inputs := map[string]float64{
		"source": -10,
	}

	variable := NewInvert("result", "source")

	result := variable.Compute(inputs)

	if result != 10 {
		t.Errorf("Expected -10, got %v", result)
	}
}
