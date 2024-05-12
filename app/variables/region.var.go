package variables

// Region is a UI-only variable. This file exists to support (de)serialization only

const (
	T_Region string = "region"
)

type Region struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Width  int `json:"width"`
	Height int `json:"height"`

	Layer  int  `json:"layer"`
	Locked bool `json:"locked"`
}

func (v Region) Compute(inputs map[string]float64, step int) float64 {
	return 0
}

func (v Region) GetInputs() []string {
	return []string{}
}

func (v Region) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Region
	return info
}
