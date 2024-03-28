package distributions

import "math/rand"

const T_Uniform string = "uniform"

type Uniform struct {
	Type string  `json:"type"`
	Min  float64 `json:"min"`
	Max  float64 `json:"max"`
}

func NewUniform(min float64, max float64) Uniform {
	return Uniform{T_Uniform, min, max}
}

func (u Uniform) Sample() float64 {
	return rand.Float64()*(u.Max-u.Min) + u.Min
}
