package variables

import "math"

const (
	T_Power string = "power"
)

type Power struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Base     string `json:"base"`
	Exponent string `json:"exponent"`
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

func (v Power) GetInputs() []string {
	return []string{v.Base, v.Exponent}
}

func (v Power) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Power
	return info
}
