package shared

import (
	"samvasta.com/weatherman/simulator/variables"
)

type Model struct {
	AllVariables []variables.Variable `yaml:"variables"`
}

func NewModel() Model {
	return Model{}
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
		vars[v.GetInfo().Name] = v
	}

	return vars
}
