package variables

const (
	T_Divide string = "divide"
)

type Divide struct {
	VariableInfo `yaml:",inline" mapstructure:",squash"`

	Quotient string
	Divisor  string
}

func NewDivide(name string, quotient string, divisor string) Divide {
	return Divide{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Divide,
		},
		Quotient: quotient,
		Divisor:  divisor,
	}
}

func (v Divide) Compute(inputs map[string]float64) float64 {
	return inputs[v.Quotient] / inputs[v.Divisor]
}

func (v Divide) Inputs() []string {
	return []string{v.Quotient, v.Divisor}
}

func (v Divide) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Divide
	return info
}
