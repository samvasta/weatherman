package variables

import "math"

const (
	T_Floor string = "floor"
	T_Ceil  string = "ceil"
	T_Round string = "round"
)

type Floor struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Input string `json:"input"`
}

func NewFloor(name string, input string) Floor {
	return Floor{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Floor,
		},
		Input: input,
	}
}

func (v Floor) Compute(inputs map[string]float64, step int) float64 {
	return math.Floor(inputs[v.Input])
}

func (v Floor) GetInputs() []string {
	return []string{v.Input}
}

func (v Floor) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Floor
	return info
}

type Ceil struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Input string `json:"input"`
}

func NewCeil(name string, input string) Ceil {
	return Ceil{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Ceil,
		},
		Input: input,
	}
}

func (v Ceil) Compute(inputs map[string]float64, step int) float64 {
	return math.Ceil(inputs[v.Input])
}

func (v Ceil) GetInputs() []string {
	return []string{v.Input}
}

func (v Ceil) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Ceil
	return info
}

type Round struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Input string `json:"input"`
}

func NewRound(name string, input string) Round {
	return Round{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Round,
		},
		Input: input,
	}
}

func (v Round) Compute(inputs map[string]float64, step int) float64 {
	return math.Round(inputs[v.Input])
}

func (v Round) GetInputs() []string {
	return []string{v.Input}
}

func (v Round) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Round
	return info
}
