package distributions

type Constant struct {
	Value float64
}

func (c Constant) Sample() float64 {
	return c.Value
}
