package sim

import (
	"strings"
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/shared"
	"samvasta.com/weatherman/simulator/variables"
)

func TestTopologicalSort(t *testing.T) {
	// Build dummy model

	a1 := variables.NewIVar("a1", distributions.NewConstant(1))

	a2 := variables.NewIVar("a2", distributions.NewConstant(1))

	a3 := variables.NewIVar("a3", distributions.NewConstant(1))

	b1 := variables.NewSum("b1", []string{"a1", "a2"})

	b2 := variables.NewSum("b2", []string{"a2", "a3"})

	// This is the tricky part. B1 also depends on A1 so A1 should be before B1 AND C1
	c1 := variables.NewSum("c1", []string{"b1", "b2", "a1"})

	collector := variables.NewCollector("collector", "c1")

	// Run topological sort
	sorted := TopologicalSort(
		[]variables.Collector{collector},
		shared.GetVariablesMap([]variables.Variable{a1, a2, a3, b1, b2, c1, collector}),
	)

	// Check the order
	sortedNames := []string{}
	for _, v := range sorted {
		sortedNames = append(sortedNames, v.GetInfo().Name)
	}

	if sortedNames[6] != "collector" {
		t.Errorf("Expected collector, got %v", sortedNames[0])
	}

	if sortedNames[5] != "c1" {
		t.Errorf("Expected C1, got %v", sortedNames[1])
	}

	b1Index := strings.Index(strings.Join(sortedNames, " "), "b1")
	b2Index := strings.Index(strings.Join(sortedNames, " "), "b2")
	a1Index := strings.Index(strings.Join(sortedNames, " "), "a1")
	a2Index := strings.Index(strings.Join(sortedNames, " "), "a2")
	a3Index := strings.Index(strings.Join(sortedNames, " "), "a3")

	if b1Index < a1Index || b1Index < a2Index {
		t.Errorf("Expected B1 to be after A1 and A2, got B1=%v, A1=%v, A2=%v", b1Index, a1Index, a2Index)
	}

	if b2Index < a2Index || b2Index < a3Index {
		t.Errorf("Expected B2 to be after A2 and A3, got B2=%v, A2=%v, A3=%v", b2Index, a2Index, a3Index)
	}
}
