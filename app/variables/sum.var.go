package variables

const (
	T_Sum string = "sum"
)

type Sum struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Inputs []string `json:"inputs"`
}

func NewSum(name string, inputs []string) Sum {
	return Sum{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Sum,
		},
		Inputs: inputs,
	}
}

func (v Sum) Compute(inputs map[string]float64, step int) float64 {
	sum := 0.0

	for _, dep := range v.Inputs {
		sum += inputs[dep]
	}

	return sum
}

func (v Sum) GetInputs() []string {
	return v.Inputs
}

func (v Sum) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Sum
	return info
}
