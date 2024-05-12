package variables

const (
	T_Equals      string = "equals"
	T_LessThan    string = "less"
	T_LessOrEqual string = "lessOrEqual"
)

type Equals struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	TestA string `json:"testA"`
	TestB string `json:"testB"`

	True  string `json:"true"`
	False string `json:"false"`
}

func NewEquals(name string, testA, testB, trueCase, falseCase string) Equals {
	return Equals{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Equals,
		},

		TestA: testA,
		TestB: testB,

		True:  trueCase,
		False: falseCase,
	}
}

func (v Equals) Compute(inputs map[string]float64, step int) float64 {
	if inputs[v.TestA] == inputs[v.TestB] {
		return inputs[v.True]
	}
	return inputs[v.False]
}

func (v Equals) GetInputs() []string {
	return []string{v.TestA, v.TestB, v.True, v.False}
}

func (v Equals) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Equals
	return info
}

type LessThan struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	TestA string `json:"testA"`
	TestB string `json:"testB"`

	True  string `json:"true"`
	False string `json:"false"`
}

func NewLessThan(name string, testA, testB, trueCase, falseCase string) LessThan {
	return LessThan{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_LessThan,
		},

		TestA: testA,
		TestB: testB,

		True:  trueCase,
		False: falseCase,
	}
}

func (v LessThan) Compute(inputs map[string]float64, step int) float64 {
	if inputs[v.TestA] < inputs[v.TestB] {
		return inputs[v.True]
	}
	return inputs[v.False]
}

func (v LessThan) GetInputs() []string {
	return []string{v.TestA, v.TestB, v.True, v.False}
}

func (v LessThan) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_LessThan
	return info
}

type LessOrEqual struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	TestA string `json:"testA"`
	TestB string `json:"testB"`

	True  string `json:"true"`
	False string `json:"false"`
}

func NewLessOrEqual(name string, testA, testB, trueCase, falseCase string) LessOrEqual {
	return LessOrEqual{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_LessOrEqual,
		},

		TestA: testA,
		TestB: testB,

		True:  trueCase,
		False: falseCase,
	}
}

func (v LessOrEqual) Compute(inputs map[string]float64, step int) float64 {
	if inputs[v.TestA] <= inputs[v.TestB] {
		return inputs[v.True]
	}
	return inputs[v.False]
}

func (v LessOrEqual) GetInputs() []string {
	return []string{v.TestA, v.TestB, v.True, v.False}
}

func (v LessOrEqual) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_LessOrEqual
	return info
}
