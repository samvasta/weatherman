package variables

const (
	T_Product string = "product"
)

type Product struct {
	VariableInfo `json:",inline" mapstructure:",squash"`

	Inputs []string `json:"inputs"`
}

func NewProduct(name string, inputs []string) Product {
	return Product{
		VariableInfo: VariableInfo{
			Name: name,
			Type: T_Product,
		},
		Inputs: inputs,
	}
}

func (v Product) Compute(inputs map[string]float64, step int) float64 {
	sum := 1.0

	for _, dep := range v.Inputs {
		sum *= inputs[dep]
	}

	return sum
}

func (v Product) GetInputs() []string {
	return v.Inputs
}

func (v Product) GetInfo() VariableInfo {
	info := v.VariableInfo
	info.Type = T_Product
	return info
}
