package distributions

const T_Constant string = "constant"

type Constant struct {
	Type  string  `json:"type"`
	Value float64 `json:"value"`
}

func NewConstant(value float64) Constant {
	return Constant{T_Constant, value}
}

func (c Constant) Sample() float64 {
	return c.Value
}
