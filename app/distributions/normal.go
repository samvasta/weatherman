package distributions

import "math/rand"

const T_Normal string = "normal"

type Normal struct {
	Type   string  `json:"type"`
	Mean   float64 `json:"mean"`
	StdDev float64 `json:"stdDev"`
}

func NewNormal(mean float64, stdDev float64) Normal {
	return Normal{T_Normal, mean, stdDev}
}

func (n Normal) Sample() float64 {
	return rand.NormFloat64()*n.StdDev + n.Mean
}
