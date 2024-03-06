package variables

type Sum struct {
	VariableInfo

	Variables []Variable
}

func (s Sum) Compute(inputs map[string]float64) float64 {
	sum := 0.0

	for _, v := range s.Variables {
		sum += inputs[v.GetInfo().Name]
	}

	return sum
}

func (s Sum) Inputs() []Variable {
	return s.Variables
}

func (s Sum) GetInfo() VariableInfo {
	return s.VariableInfo
}
