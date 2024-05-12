package shared

import (
	"samvasta.com/weatherman/app/variables"
)

const CURRENT_VERSION = 1

type ModelMeta struct {
	Version int `json:"version"`
}

type Model struct {
	Meta         ModelMeta            `json:"meta"`
	AllVariables []variables.Variable `json:"variables"`
	Steps        int                  `json:"steps"`
	Iterations   int                  `json:"iterations"`
}

func NewModel() Model {
	return Model{
		Meta: ModelMeta{
			Version: CURRENT_VERSION,
		},
		AllVariables: []variables.Variable{},
		Steps:        50,
		Iterations:   5_000,
	}
}

func (m *Model) AllCollectors() []variables.Collector {
	collectors := make([]variables.Collector, 0)

	for _, v := range m.AllVariables {
		if v.GetInfo().Type == variables.T_Collector {
			if c, ok := v.(variables.Collector); ok {
				collectors = append(collectors, c)
			}
		}
	}

	return collectors
}

func (m *Model) AddVariable(v variables.Variable) {
	m.AllVariables = append(m.AllVariables, v)
}

func GetVariablesMap(allVariables []variables.Variable) map[string]variables.Variable {
	vars := make(map[string]variables.Variable)

	for _, v := range allVariables {
		if v.GetInfo().Type != variables.T_Region {
			vars[v.GetInfo().Name] = v
		}
	}

	return vars
}
