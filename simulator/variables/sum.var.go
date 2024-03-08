package variables

const (
	T_Sum string = "sum"
)

type Sum struct {
	VariableInfo `yaml:",inline" mapstructure:",squash"`

	Variables []string
}

func NewSum(name string, inputs []string) Sum {
	return Sum{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Sum,
		},
		Variables: inputs,
	}
}

func (v Sum) Compute(inputs map[string]float64) float64 {
	sum := 0.0

	for _, dep := range v.Variables {
		sum += inputs[dep]
	}

	return sum
}

func (v Sum) Inputs() []string {
	return v.Variables
}

func (v Sum) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Sum
	return info
}
