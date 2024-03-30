package variables

import "samvasta.com/weatherman/app/distributions"

type VariableType string

const (
	T_IVar string = "ivar"
)

type VariableInfo struct {
	Name        string `json:"name"`
	Description string `json:"description"`

	Units string `json:"units"`

	Type string `json:"type"`

	Ui map[string]interface{} `json:"ui"`
}

type Variable interface {
	GetInfo() VariableInfo
	Compute(inputs map[string]float64) float64
	GetInputs() []string
}

// IVar is short for "independent variable"
type IVar struct {
	VariableInfo `json:",inline" mapstructure:",squash"`
	Distribution distributions.Distribution `json:"distribution" mapstructure:",ignore"`
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

func (v IVar) GetInputs() []string {
	return []string{}
}
