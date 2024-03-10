package variables

const (
	T_Invert string = "invert"
)

// Invert is a variable that reflects the value of another variable across 0 (multiplies by -1).
type Invert struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Input string `json:"input"`
}

func NewInvert(name string, input string) Invert {
	return Invert{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Invert,
		},
		Input: input,
	}
}

func (v Invert) Compute(inputs map[string]float64) float64 {
	return -1 * inputs[v.Input]
}

func (v Invert) GetInputs() []string {
	return []string{v.Input}
}

func (v Invert) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Invert
	return info
}
