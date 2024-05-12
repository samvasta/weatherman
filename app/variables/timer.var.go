package variables

import (
	"sort"
)

const (
	T_Timer string = "timer"
)

type TimeRange struct {
	StartStep int    `json:"startStep"`
	Input     string `json:"input"`
}

type Timer struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	DefaultInput string      `json:"defaultInput"`
	TimeRanges   []TimeRange `json:"timeRanges"`

	sortedTimeRanges []TimeRange
}

func NewTimer(name string, defaultInput string, timeRanges []TimeRange) Timer {
	timer := Timer{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Timer,
		},

		DefaultInput: defaultInput,
		TimeRanges:   timeRanges,

		sortedTimeRanges: make([]TimeRange, 0),
	}
	timer.Prepare()
	return timer
}

func (v *Timer) Prepare() {
	v.sortedTimeRanges = make([]TimeRange, len(v.TimeRanges))
	copy(v.sortedTimeRanges, v.TimeRanges)
	sort.Slice(v.sortedTimeRanges, func(i, j int) bool {
		return v.sortedTimeRanges[i].StartStep > v.sortedTimeRanges[j].StartStep
	})
}

func (v Timer) Compute(inputs map[string]float64, step int) float64 {
	for _, timeRange := range v.sortedTimeRanges {
		if step >= timeRange.StartStep {
			return inputs[timeRange.Input]
		}
	}

	return inputs[v.DefaultInput]
}

func (v Timer) GetInputs() []string {
	inputs := []string{v.DefaultInput}

	for _, timeRange := range v.TimeRanges {
		inputs = append(inputs, timeRange.Input)
	}

	return inputs
}

func (v Timer) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Timer
	return info
}
