package variables

const (
	T_Divide string = "divide"
)

type Divide struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Dividend string `json:"dividend"`
	Divisor  string `json:"divisor"`
}

func NewDivide(name string, dividend string, divisor string) Divide {
	return Divide{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Divide,
		},
		Dividend: dividend,
		Divisor:  divisor,
	}
}

func (v Divide) Compute(inputs map[string]float64, step int) float64 {
	return inputs[v.Dividend] / inputs[v.Divisor]
}

func (v Divide) GetInputs() []string {
	return []string{v.Dividend, v.Divisor}
}

func (v Divide) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Divide
	return info
}
