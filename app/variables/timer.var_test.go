package variables

import (
	"testing"
)

func TestNewTimer(t *testing.T) {
	variable := NewTimer("result", "a", []TimeRange{{3, "b"}})

	if variable.Type != T_Timer {
		t.Errorf("Expected type=Timer, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.DefaultInput != "a" {
		t.Errorf("Expected a, got %v", variable.DefaultInput)
	}

	if variable.TimeRanges[0].Input != "b" {
		t.Errorf("Expected b, got %v", variable.TimeRanges[0].Input)
	}

	if variable.TimeRanges[0].StartStep != 3 {
		t.Errorf("Expected b, got %v", variable.TimeRanges[0].StartStep)
	}
}

func TestTimer(t *testing.T) {
	inputs := map[string]float64{
		"a": 16,
		"b": 2.5,
	}

	variable := NewTimer("result", "a", []TimeRange{{3, "b"}})

	result := variable.Compute(inputs, 0)

	if result != 16 {
		t.Errorf("Expected 16 on step 0, got %v", result)
	}

	result = variable.Compute(inputs, 2)

	if result != 16 {
		t.Errorf("Expected 16 on step 2, got %v", result)
	}

	result = variable.Compute(inputs, 3)

	if result != 2.5 {
		t.Errorf("Expected 16 on step 3, got %v", result)
	}

	result = variable.Compute(inputs, 10)

	if result != 2.5 {
		t.Errorf("Expected 16 on step 10, got %v", result)
	}
}

func TestTimer2(t *testing.T) {
	inputs := map[string]float64{
		"a": 16,
		"b": 2.5,
		"c": 100,
	}

	variable := NewTimer("result", "a", []TimeRange{{3, "b"}, {1, "c"}})

	expected := []float64{16, 100, 100, 2.5, 2.5, 2.5, 2.5}

	for i := 0; i < len(expected); i++ {

		result := variable.Compute(inputs, i)

		if result != expected[i] {
			t.Errorf("Expected %v on step 0, got %v", expected[i], result)
		}

	}
}
