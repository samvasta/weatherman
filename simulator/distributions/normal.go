package distributions

import "math/rand"

const T_Normal string = "normal"

type Normal struct {
	Type   string
	Mean   float64
	StdDev float64
}

func NewNormal(mean float64, stdDev float64) Normal {
	return Normal{T_Normal, mean, stdDev}
}

func (n Normal) Sample() float64 {
	return rand.NormFloat64()*n.StdDev + n.Mean
}
