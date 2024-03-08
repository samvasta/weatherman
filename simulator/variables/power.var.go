package variables

import "math"

const (
	T_Power string = "power"
)

type Power struct {
	VariableInfo `yaml:",inline" mapstructure:",squash"`

	Base     string
	Exponent string
}

func NewPower(name string, base string, exponent string) Power {
	return Power{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Power,
		},
		Base:     base,
		Exponent: exponent,
	}
}

func (v Power) Compute(inputs map[string]float64) float64 {
	return math.Pow(inputs[v.Base], inputs[v.Exponent])
}

func (v Power) Inputs() []string {
	return []string{v.Base, v.Exponent}
}

func (v Power) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Power
	return info
}
