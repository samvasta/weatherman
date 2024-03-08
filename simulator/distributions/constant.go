package distributions

const T_Constant string = "constant"

type Constant struct {
	Type  string
	Value float64
}

func NewConstant(value float64) Constant {
	return Constant{T_Constant, value}
}

func (c Constant) Sample() float64 {
	return c.Value
}
