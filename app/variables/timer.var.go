package variables

import "sort"

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
	sortedTimeRanges := make([]TimeRange, len(timeRanges))
	copy(sortedTimeRanges, timeRanges)
	sort.Slice(sortedTimeRanges, func(i, j int) bool {
		return sortedTimeRanges[i].StartStep < sortedTimeRanges[j].StartStep
	})
	return Timer{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Timer,
		},

		DefaultInput: defaultInput,
		TimeRanges:   timeRanges,

		sortedTimeRanges: sortedTimeRanges,
	}
}

func (v Timer) Compute(inputs map[string]float64, step int) float64 {
	for _, timeRange := range v.TimeRanges {
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
