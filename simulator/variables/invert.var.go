package variables

// Invert is a variable that reflects the value of another variable across 0 (multiplies by -1).
type Invert struct {
	VariableInfo

	input Variable
}

func (s Invert) Compute(inputs map[string]float64) float64 {
	return -1 * inputs[s.input.GetInfo().Name]
}

func (s Invert) Inputs() []Variable {
	return []Variable{s.input}
}

func (s Invert) GetInfo() VariableInfo {
	return s.VariableInfo
}
