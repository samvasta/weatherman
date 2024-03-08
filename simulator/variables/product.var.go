package variables

const (
	T_Product string = "product"
)

type Product struct {
	VariableInfo `yaml:",inline" mapstructure:",squash"`

	Variables []string
}

func NewProduct(name string, inputs []string) Product {
	return Product{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Product,
		},
		Variables: inputs,
	}
}

func (v Product) Compute(inputs map[string]float64) float64 {
	sum := 1.0

	for _, dep := range v.Variables {
		sum *= inputs[dep]
	}

	return sum
}

func (v Product) Inputs() []string {
	return v.Variables
}

func (v Product) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Product
	return info
}
