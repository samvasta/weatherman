package variables

import "samvasta.com/weatherman/simulator/distributions"

type VariableInfo struct {
	Name        string
	Description string

	Units string
}

type Variable interface {
	GetInfo() VariableInfo
	Compute(inputs map[string]float64) float64
	Inputs() []Variable
}

// IVar is short for "independent variable"
type IVar struct {
	VariableInfo
	Distribution distributions.Distribution
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

func (v IVar) Inputs() []Variable {
	return []Variable{}
}

// Collectors collect the output of a variable and store it to be used as the input for an IVar in the next time step
type Collector struct {
	VariableInfo

	Input  Variable
	Target *IVar
}

func (v Collector) GetInfo() VariableInfo {
	return v.VariableInfo
}

func (v Collector) Compute(inputs map[string]float64) float64 {
	return inputs[v.Input.GetInfo().Name]
}

func (v Collector) Inputs() []Variable {
	return []Variable{v.Input}
}
