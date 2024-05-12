package variables

import "sort"

const (
	T_Multiplexer string = "multiplexer"
)

type MuxInput struct {
	MinValue int    `json:"minValue"`
	Input    string `json:"input"`
}

type Multiplexer struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	SelectorInput string `json:"selectorInput"`

	DefaultInput string     `json:"defaultInput"`
	MuxInputs    []MuxInput `json:"MuxInputs"`

	sortedMuxInputs []MuxInput
}

func NewMultiplexer(name string, selectorInput, defaultInput string, MuxInputs []MuxInput) Multiplexer {
	sortedMuxInputs := make([]MuxInput, len(MuxInputs))
	copy(sortedMuxInputs, MuxInputs)
	sort.Slice(sortedMuxInputs, func(i, j int) bool {
		return sortedMuxInputs[i].MinValue < sortedMuxInputs[j].MinValue
	})
	return Multiplexer{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Multiplexer,
		},

		SelectorInput: selectorInput,
		DefaultInput:  defaultInput,
		MuxInputs:     MuxInputs,

		sortedMuxInputs: sortedMuxInputs,
	}
}

func (v Multiplexer) Compute(inputs map[string]float64, step int) float64 {
	selectorValue := inputs[v.SelectorInput]
	for _, MuxInput := range v.MuxInputs {
		if int(selectorValue) >= MuxInput.MinValue {
			return inputs[MuxInput.Input]
		}
	}

	return inputs[v.DefaultInput]
}

func (v Multiplexer) GetInputs() []string {
	inputs := []string{v.DefaultInput}

	for _, MuxInput := range v.MuxInputs {
		inputs = append(inputs, MuxInput.Input)
	}

	return inputs
}

func (v Multiplexer) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Multiplexer
	return info
}
