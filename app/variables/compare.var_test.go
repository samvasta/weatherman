package variables

import (
	"testing"
)

func TestNewEquals(t *testing.T) {
	variable := NewEquals("result", "testA", "testB", "true", "false")

	if variable.Type != T_Equals {
		t.Errorf("Expected type=divide, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.TestA != "testA" {
		t.Errorf("Expected testA, got %v", variable.TestA)
	}

	if variable.TestB != "testB" {
		t.Errorf("Expected testB, got %v", variable.TestB)
	}

	if variable.True != "true" {
		t.Errorf("Expected true, got %v", variable.True)
	}

	if variable.False != "false" {
		t.Errorf("Expected false, got %v", variable.False)
	}
}

func TestEquals(t *testing.T) {
	inputs := map[string]float64{
		"testA": 10,
		"testB": 2,
		"true":  1,
		"false": 0,
	}

	variable := NewEquals("result", "testA", "testB", "true", "false")

	result := variable.Compute(inputs)

	if result != 0 {
		t.Errorf("Expected 0, got %v", result)
	}

	inputs["testB"] = inputs["testA"]

	result = variable.Compute(inputs)

	if result != 1 {
		t.Errorf("Expected 1, got %v", result)
	}
}

func TestNewLessThan(t *testing.T) {
	variable := NewLessThan("result", "testA", "testB", "true", "false")

	if variable.Type != T_LessThan {
		t.Errorf("Expected type=divide, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.TestA != "testA" {
		t.Errorf("Expected testA, got %v", variable.TestA)
	}

	if variable.TestB != "testB" {
		t.Errorf("Expected testB, got %v", variable.TestB)
	}

	if variable.True != "true" {
		t.Errorf("Expected true, got %v", variable.True)
	}

	if variable.False != "false" {
		t.Errorf("Expected false, got %v", variable.False)
	}
}

func TestLessThan(t *testing.T) {
	inputs := map[string]float64{
		"testA": 10,
		"testB": 2,
		"true":  1,
		"false": 0,
	}

	variable := NewLessThan("result", "testA", "testB", "true", "false")

	result := variable.Compute(inputs)

	if result != 0 {
		t.Errorf("Expected 0, got %v", result)
	}

	inputs["testB"] = inputs["testA"]

	result = variable.Compute(inputs)

	if result != 0 {
		t.Errorf("Expected 0, got %v", result)
	}

	inputs["testB"] = inputs["testA"] + 1

	result = variable.Compute(inputs)

	if result != 1 {
		t.Errorf("Expected 1, got %v", result)
	}
}

func TestNewLessOrEqual(t *testing.T) {
	variable := NewLessOrEqual("result", "testA", "testB", "true", "false")

	if variable.Type != T_LessOrEqual {
		t.Errorf("Expected type=divide, got %v", variable.Type)
	}

	if variable.Name != "result" {
		t.Errorf("Expected result, got %v", variable.Name)
	}

	if variable.TestA != "testA" {
		t.Errorf("Expected testA, got %v", variable.TestA)
	}

	if variable.TestB != "testB" {
		t.Errorf("Expected testB, got %v", variable.TestB)
	}

	if variable.True != "true" {
		t.Errorf("Expected true, got %v", variable.True)
	}

	if variable.False != "false" {
		t.Errorf("Expected false, got %v", variable.False)
	}
}

func TestLessOrEqual(t *testing.T) {
	inputs := map[string]float64{
		"testA": 10,
		"testB": 2,
		"true":  1,
		"false": 0,
	}

	variable := NewLessOrEqual("result", "testA", "testB", "true", "false")

	result := variable.Compute(inputs)

	if result != 0 {
		t.Errorf("Expected 0, got %v", result)
	}

	inputs["testB"] = inputs["testA"]

	result = variable.Compute(inputs)

	if result != 1 {
		t.Errorf("Expected 1, got %v", result)
	}

	inputs["testB"] = inputs["testA"] + 1

	result = variable.Compute(inputs)

	if result != 1 {
		t.Errorf("Expected 1, got %v", result)
	}
}
