package variables

const (
	T_Collector string = "collector"
)

// Collectors collect the output of a variable and store it to be used as the input for an IVar in the next time step
type Collector struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Input  string `json:"input"`
	Target string `json:"target"`
}

func NewCollector(name string, input string) Collector {
	return Collector{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Collector,
		},
		Input: input,
	}
}

func (v Collector) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Collector
	return info
}

func (v Collector) Compute(inputs map[string]float64, step int) float64 {
	return inputs[v.Input]
}

func (v Collector) GetInputs() []string {
	return []string{v.Input}
}
