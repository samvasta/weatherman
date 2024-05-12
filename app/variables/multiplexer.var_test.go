package variables

import (
	"testing"
)

func TestNewMultiplexer(t *testing.T) {
	variable := NewMultiplexer("result", "a", "b", []MuxInput{{3, "c"}})

	if variable.Type != T_Multiplexer {
		t.Errorf("Expected type=Multiplexer, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.SelectorInput != "a" {
		t.Errorf("Expected a, got %v", variable.SelectorInput)
	}

	if variable.DefaultInput != "b" {
		t.Errorf("Expected b, got %v", variable.DefaultInput)
	}

	if variable.MuxInputs[0].Input != "c" {
		t.Errorf("Expected c, got %v", variable.MuxInputs[0].Input)
	}

	if variable.MuxInputs[0].MinValue != 3 {
		t.Errorf("Expected b, got %v", variable.MuxInputs[0].MinValue)
	}
}

func TestMultiplexer(t *testing.T) {
	inputs := map[string]float64{
		"a": 1,
		"b": 2.5,
		"c": 20,
	}

	variable := NewMultiplexer("result", "a", "b", []MuxInput{{3, "c"}})

	result := variable.Compute(inputs, 0)

	if result != 2.5 {
		t.Errorf("Expected 2.5, got %v", result)
	}
}

func TestMultiplexer2(t *testing.T) {
	inputs := map[string]float64{
		"a": 4,
		"b": 2.5,
		"c": 20,
		"d": 100,
	}

	variable := NewMultiplexer("result", "a", "b", []MuxInput{{5, "d"}, {3, "c"}})

	result := variable.Compute(inputs, 0)

	if result != 20 {
		t.Errorf("Expected 20, got %v", result)
	}
}

func TestMultiplexer3(t *testing.T) {
	inputs := map[string]float64{
		"a": 5,
		"b": 2.5,
		"c": 20,
		"d": 100,
	}

	variable := NewMultiplexer("result", "a", "b", []MuxInput{{5, "d"}, {3, "c"}})

	result := variable.Compute(inputs, 0)

	if result != 100 {
		t.Errorf("Expected 100, got %v", result)
	}
}
