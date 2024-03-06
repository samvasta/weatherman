package variables

import "math"

type Power struct {
	VariableInfo

	Base     Variable
	Exponent Variable
}

func (s Power) Compute(inputs map[string]float64) float64 {
	return math.Pow(inputs[s.Base.GetInfo().Name], inputs[s.Exponent.GetInfo().Name])
}

func (s Power) Inputs() []Variable {
	return []Variable{s.Base, s.Exponent}
}

func (s Power) GetInfo() VariableInfo {
	return s.VariableInfo
}
