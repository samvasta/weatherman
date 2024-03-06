package distributions

import "math/rand"

type Uniform struct {
	Min float64
	Max float64
}

func (u Uniform) Sample() float64 {
	return rand.Float64()*(u.Max-u.Min) + u.Min
}
