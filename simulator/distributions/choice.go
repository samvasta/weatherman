package distributions

import "math/rand"

const T_Choice string = "choice"

type WeightedOption struct {
	Weight float64
	Value  float64
}

type Choice struct {
	Type        string
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
	return Choice{T_Choice, weightedOptions, totalWeight}
}

func NewWeightedChoice(options []WeightedOption) Choice {
	totalWeight := 0.0
	for _, option := range options {
		totalWeight += option.Weight
	}
	return Choice{T_Choice, options, totalWeight}
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
