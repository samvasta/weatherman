package distributions

import (
	"math"
	"math/rand"
)

const T_Laplace string = "laplace"

type Laplace struct {
	Type   string  `json:"type"`
	Mean   float64 `json:"mean"`
	StdDev float64 `json:"stdDev"`
	beta   float64 `json:"-"`
}

func NewLaplace(mean float64, stdDev float64) Laplace {
	beta := math.Sqrt((stdDev * stdDev) / 2)
	return Laplace{T_Laplace, mean, stdDev, beta}
}

func (l Laplace) ComputeBeta() Laplace {
	l.beta = math.Sqrt((l.StdDev * l.StdDev) / 2)
	return l
}

func (l Laplace) Sample() float64 {
	sign := 1.0

	sample := rand.Float64() - 0.5

	if sample < 0 {
		sign = -1.0
	} else if sample == 0 {
		return l.Mean
	}

	v := l.Mean - l.beta*sign*math.Log(1.0-2.0*math.Abs(sample))

	return v
}
