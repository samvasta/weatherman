package serialize

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/mitchellh/mapstructure"
	"samvasta.com/weatherman/app/distributions"
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/variables"
)

func SaveModelToFile(m *shared.Model, path string) error {

	bytes, err := SerializeModel(m)

	if err != nil {
		return err
	}

	err = os.WriteFile(path, bytes, 0644)
	return err
}

func SerializeModel(m *shared.Model) ([]byte, error) {
	return json.Marshal(m)
}

func ReadModelFromFile(path string) (*shared.Model, error) {
	bytes, err := os.ReadFile(path)

	if err != nil {
		return nil, err
	}

	return DeserializeModel(bytes)
}

func DeserializeModel(bytes []byte) (*shared.Model, error) {
	var m struct {
		AllVariables [](map[string]interface{}) `json:"variables"`
	}
	err := json.Unmarshal(bytes, &m)

	model := shared.NewModel()

	for _, v := range m.AllVariables {
		variable, err := DeserializeVariable(v)
		if err != nil {
			return nil, err
		}

		model.AddVariable(variable)
	}

	return &model, err
}

func DeserializeVariable(v map[string]interface{}) (variables.Variable, error) {
	switch v["type"] {
	case variables.T_Collector:
		var collector variables.Collector
		err := mapstructure.Decode(v, &collector)
		return collector, err
	case variables.T_Divide:
		var divide variables.Divide
		err := mapstructure.Decode(v, &divide)
		return divide, err
	case variables.T_Invert:
		var invert variables.Invert
		err := mapstructure.Decode(v, &invert)
		return invert, err
	case variables.T_Power:
		var power variables.Power
		err := mapstructure.Decode(v, &power)
		return power, err
	case variables.T_IVar:
		var varInfo struct {
			Info variables.VariableInfo `mapstructure:",squash"`
			Rest map[string]interface{} `mapstructure:",remain"`
		}

		err := mapstructure.Decode(v, &varInfo)
		if err != nil {
			return nil, err
		}
		distribution, err := DeserializeDistribution(varInfo.Rest["distribution"].(map[string]interface{}))
		ivar := variables.IVar{VariableInfo: varInfo.Info, Distribution: distribution}
		return ivar, err
	case variables.T_Product:
		var product variables.Product
		err := mapstructure.Decode(v, &product)
		return product, err
	case variables.T_Sum:
		var sum variables.Sum
		err := mapstructure.Decode(v, &sum)
		return sum, err

	default:
		return nil, fmt.Errorf("unknown variable type: %v (%v)", v["type"], v)
	}
}

func DeserializeDistribution(d map[string]interface{}) (distributions.Distribution, error) {
	switch d["type"] {
	case distributions.T_Choice:
		var choice distributions.Choice
		err := mapstructure.Decode(d, &choice)
		return choice, err
	case distributions.T_Constant:
		var constant distributions.Constant
		err := mapstructure.Decode(d, &constant)
		return constant, err

	case distributions.T_Normal:
		var normal distributions.Normal
		err := mapstructure.Decode(d, &normal)
		return normal, err

	case distributions.T_Laplace:
		var laplace distributions.Laplace
		err := mapstructure.Decode(d, &laplace)
		return laplace, err

	case distributions.T_Uniform:
		var uniform distributions.Uniform
		err := mapstructure.Decode(d, &uniform)
		return uniform, err
	default:
		return nil, fmt.Errorf("unknown distribution type: %v (%v)", d["type"], d)
	}
}
