package variables

import (
	"sort"
)

const (
	T_Multiplexer string = "multiplexer"
)

type MuxInput struct {
	MinValue float64 `json:"minValue"`
	Input    string  `json:"input"`
}

type Multiplexer struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Selector string `json:"selector"`

	DefaultInput string     `json:"defaultInput"`
	MuxInputs    []MuxInput `json:"muxInputs"`

	sortedMuxInputs []MuxInput
}

func NewMultiplexer(name string, selectorInput, defaultInput string, MuxInputs []MuxInput) Multiplexer {
	mux := Multiplexer{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Multiplexer,
		},

		Selector:     selectorInput,
		DefaultInput: defaultInput,
		MuxInputs:    MuxInputs,

		sortedMuxInputs: make([]MuxInput, 0),
	}
	mux.Prepare()
	return mux
}

func (v *Multiplexer) Prepare() {
	v.sortedMuxInputs = make([]MuxInput, len(v.MuxInputs))
	copy(v.sortedMuxInputs, v.MuxInputs)
	sort.Slice(v.sortedMuxInputs, func(i, j int) bool {
		return v.sortedMuxInputs[i].MinValue > v.sortedMuxInputs[j].MinValue
	})
}

func (v Multiplexer) Compute(inputs map[string]float64, step int) float64 {
	selectorValue := inputs[v.Selector]
	for _, muxInput := range v.sortedMuxInputs {
		if selectorValue >= muxInput.MinValue {
			return inputs[muxInput.Input]
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
