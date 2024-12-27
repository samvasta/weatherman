package distributions

import "math/rand"

const T_Asymmetric_Normal string = "asymmetric_normal"

type Asymmetric_Normal struct {
	Type       string  `json:"type"`
	Mean       float64 `json:"mean"`
	StdDevLow  float64 `json:"stdDevLow"`
	StdDevHigh float64 `json:"stdDevHigh"`
	Min        float64 `json:"min"`
	Max        float64 `json:"max"`
}

func NewAsymmetric_Normal(mean, stdDevLow, stdDevHigh, min, max float64) Asymmetric_Normal {
	return Asymmetric_Normal{T_Asymmetric_Normal, mean, stdDevLow, stdDevHigh, min, max}
}

func (n Asymmetric_Normal) Sample() float64 {
	sample := rand.NormFloat64()
	if sample < 0 {
		return max(sample*n.StdDevLow+n.Mean, n.Min)
	}
	return min(sample*n.StdDevHigh+n.Mean, n.Max)
}
