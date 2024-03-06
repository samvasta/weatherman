package variables

type Divide struct {
	VariableInfo

	Quotient Variable
	Divisor  Variable
}

func (s Divide) Compute(inputs map[string]float64) float64 {
	return inputs[s.Quotient.GetInfo().Name] / inputs[s.Divisor.GetInfo().Name]
}

func (s Divide) Inputs() []Variable {
	return []Variable{s.Quotient, s.Divisor}
}

func (s Divide) GetInfo() VariableInfo {
	return s.VariableInfo
}
