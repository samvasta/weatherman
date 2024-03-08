package variables

import "samvasta.com/weatherman/simulator/distributions"

type VariableType string

const (
	T_IVar string = "ivar"
)

type VariableInfo struct {
	Name        string
	Description string

	Units string

	Type string
}

type Variable interface {
	GetInfo() VariableInfo
	Compute(inputs map[string]float64) float64
	Inputs() []string
}

// IVar is short for "independent variable"
type IVar struct {
	VariableInfo `yaml:",inline" mapstructure:",squash"`
	Distribution distributions.Distribution `mapstructure:",ignore"`
}

func NewIVar(name string, distribution distributions.Distribution) IVar {
	return IVar{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_IVar,
		},
		Distribution: distribution,
	}
}

func (v IVar) GetInfo() VariableInfo {
	return v.VariableInfo
}

func (v IVar) Compute(inputs map[string]float64) float64 {
	val, ok := inputs[v.Name]

	if ok {
		return val
	}

	return v.Distribution.Sample()
}

func (v IVar) Inputs() []string {
	return []string{}
}
