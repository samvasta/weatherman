package distributions

import (
	"testing"
)

func TestNewUniformWeightedChoice(t *testing.T) {
	choice := NewUniformWeightedChoice([]float64{1, 2, 3})

	if len(choice.Options) != 3 {
		t.Errorf("Expected 3 options, got %v", len(choice.Options))
	}

	if choice.totalWeight != 3 {
		t.Errorf("Expected totalWeight of 3, got %v", choice.totalWeight)
	}

	for _, option := range choice.Options {
		if option.Weight != 1 {
			t.Errorf("Expected weight of 1, got %v", option.Weight)
		}
	}

	if choice.Options[0].Value != 1 {
		t.Errorf("Expected value of 1, got %v", choice.Options[0].Value)
	}

	if choice.Options[1].Value != 2 {
		t.Errorf("Expected value of 2, got %v", choice.Options[1].Value)
	}

	if choice.Options[2].Value != 3 {
		t.Errorf("Expected value of 3, got %v", choice.Options[2].Value)
	}

}

func TestSampleChoice(t *testing.T) {
	choice := NewUniformWeightedChoice([]float64{1, 2, 3})

	counts := map[int]int{0: 0, 1: 0, 2: 0, 3: 0}

	for i := 0; i < 3000; i++ {
		sample := choice.Sample()
		if sample != 1 && sample != 2 && sample != 3 {
			t.Errorf("Expected sample to be 1, 2, or 3, got %v", sample)
		}
		counts[int(sample)]++
	}

	// Expect about 1000 of each
	// This test is non-deterministic, so add some wiggle room
	if counts[1] < 900 || counts[1] > 1100 {
		t.Errorf("Expected about 100 samples of 1, got %v", counts[1])
	}

	if counts[2] < 900 || counts[2] > 1100 {
		t.Errorf("Expected about 100 samples of 2, got %v", counts[2])
	}

	if counts[3] < 900 || counts[3] > 1100 {
		t.Errorf("Expected about 100 samples of 3, got %v", counts[3])
	}

}

func TestSampleChoiceWithWeights(t *testing.T) {
	choice := NewWeightedChoice(
		[]WeightedOption{
			{1, 1},
			{2, 2},
			{3, 3},
		},
	)

	counts := map[int]int{0: 0, 1: 0, 2: 0, 3: 0}

	for i := 0; i < 60000; i++ {
		sample := choice.Sample()
		if sample != 1 && sample != 2 && sample != 3 {
			t.Errorf("Expected sample to be 1, 2, or 3, got %v", sample)
		}
		counts[int(sample)]++
	}

	// Expect about 1000 of each
	// This test is non-deterministic, so add some wiggle room
	if counts[1] < 8800 || counts[1] > 11200 {
		t.Errorf("Expected about 10000 samples of 1, got %v", counts[1])
	}

	if counts[2] < 18900 || counts[2] > 21100 {
		t.Errorf("Expected about 20000 samples of 2, got %v", counts[2])
	}

	if counts[3] < 28900 || counts[3] > 31100 {
		t.Errorf("Expected about 30000 samples of 3, got %v", counts[3])
	}

}
