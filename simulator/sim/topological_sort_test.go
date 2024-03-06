package sim

import (
	"strings"
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/variables"
)

func TestTopologicalSort(t *testing.T) {
	// Build dummy model

	a1 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "A1",
		},
		Distribution: distributions.Constant{Value: 1},
	}
	a2 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "A2",
		},
		Distribution: distributions.Constant{Value: 1},
	}
	a3 := variables.IVar{
		VariableInfo: variables.VariableInfo{
			Name: "A3",
		},
		Distribution: distributions.Constant{Value: 1},
	}

	b1 := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "B1",
		},
		Variables: []variables.Variable{a1, a2},
	}

	b2 := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "B2",
		},
		Variables: []variables.Variable{a2, a3},
	}

	c1 := variables.Sum{
		VariableInfo: variables.VariableInfo{
			Name: "C1",
		},
		// This is the tricky part. B1 also depends on A1 so A1 should be before B1 AND C1
		Variables: []variables.Variable{b1, b2, a1},
	}

	collector := variables.Collector{
		VariableInfo: variables.VariableInfo{
			Name: "collector",
		},
		Input: c1,
	}

	// Run topological sort
	sorted := TopologicalSort([]variables.Collector{collector})

	// Check the order
	sortedNames := []string{}
	for _, v := range sorted {
		sortedNames = append(sortedNames, v.GetInfo().Name)
	}

	if sortedNames[6] != "collector" {
		t.Errorf("Expected collector, got %v", sortedNames[0])
	}

	if sortedNames[5] != "C1" {
		t.Errorf("Expected C1, got %v", sortedNames[1])
	}

	b1Index := strings.Index(strings.Join(sortedNames, " "), "B1")
	b2Index := strings.Index(strings.Join(sortedNames, " "), "B2")
	a1Index := strings.Index(strings.Join(sortedNames, " "), "A1")
	a2Index := strings.Index(strings.Join(sortedNames, " "), "A2")
	a3Index := strings.Index(strings.Join(sortedNames, " "), "A3")

	if b1Index < a1Index || b1Index < a2Index {
		t.Errorf("Expected B1 to be after A1 and A2, got B1=%v, A1=%v, A2=%v", b1Index, a1Index, a2Index)
	}

	if b2Index < a2Index || b2Index < a3Index {
		t.Errorf("Expected B2 to be after A2 and A3, got B2=%v, A2=%v, A3=%v", b2Index, a2Index, a3Index)
	}
}
