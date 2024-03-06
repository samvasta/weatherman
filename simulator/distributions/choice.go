package distributions

import "math/rand"

type WeightedOption struct {
	Weight float64
	Value  float64
}

type Choice struct {
	Options     []WeightedOption
	totalWeight float64
}

func NewUniformWeightedChoice(options []float64) Choice {
	weightedOptions := make([]WeightedOption, len(options))
	totalWeight := 0.0
	for i, option := range options {
		weightedOptions[i] = WeightedOption{1.0, option}
		totalWeight += 1.0
	}
	return Choice{weightedOptions, totalWeight}
}

func NewWeightedChoice(options []WeightedOption) Choice {
	totalWeight := 0.0
	for _, option := range options {
		totalWeight += option.Weight
	}
	return Choice{options, totalWeight}
}

func (c Choice) Sample() float64 {
	r := rand.Float64() * c.totalWeight
	for _, option := range c.Options {
		r -= option.Weight
		if r <= 0 {
			return option.Value
		}
	}
	return c.Options[len(c.Options)-1].Value
}
