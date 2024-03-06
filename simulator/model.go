package simulator

import "samvasta.com/weatherman/simulator/variables"

type Model struct {
	Collectors []variables.Collector
}

func NewModel() Model {
	return Model{}
}

func (m *Model) AddCollector(c variables.Collector) {
	m.Collectors = append(m.Collectors, c)
}
