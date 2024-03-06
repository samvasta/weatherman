package variables

type Product struct {
	VariableInfo

	Variables []Variable
}

func (s Product) Compute(inputs map[string]float64) float64 {
	sum := 1.0

	for _, v := range s.Variables {
		sum *= inputs[v.GetInfo().Name]
	}

	return sum
}

func (s Product) Inputs() []Variable {
	return s.Variables
}

func (s Product) GetInfo() VariableInfo {
	return s.VariableInfo
}
