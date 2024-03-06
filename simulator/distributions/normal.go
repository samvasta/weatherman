package distributions

import "math/rand"

type Normal struct {
	Mean   float64
	StdDev float64
}

func (n Normal) Sample() float64 {
	return rand.NormFloat64()*n.StdDev + n.Mean
}
