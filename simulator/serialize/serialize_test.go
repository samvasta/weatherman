package serialize

import (
	"testing"

	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/shared"
	"samvasta.com/weatherman/simulator/variables"
)

func TestSerialize(t *testing.T) {
	model := shared.NewModel()

	i1 := variables.NewIVar("i1", distributions.NewConstant(1000))
	i2 := variables.NewIVar("i2", distributions.NewUniformWeightedChoice([]float64{1, 2, 3, 4, 5}))
	i3 := variables.NewIVar("i3", distributions.NewUniform(0, 1000))
	i4 := variables.NewIVar("i4", distributions.NewNormal(1000, 50))

	sum := variables.NewSum("sum", []string{"i1", "i2", "i3", "i4"})
	product := variables.NewProduct("product", []string{"i1", "i2", "i3", "i4"})
	power := variables.NewPower("power", "sum", "product")
	divide := variables.NewDivide("divide", "power", "product")
	invert := variables.NewInvert("invert", "divide")

	collector := variables.NewCollector("collector", "invert")

	model.AddVariable(i1)
	model.AddVariable(i2)
	model.AddVariable(i3)
	model.AddVariable(i4)
	model.AddVariable(sum)
	model.AddVariable(product)
	model.AddVariable(power)
	model.AddVariable(divide)
	model.AddVariable(invert)
	model.AddVariable(collector)

	// Save model to bytes
	bytes, err := SerializeModel(&model)

	if err != nil {
		t.Errorf("Error serializing model: %v", err)
	}

	// Deserialize model from bytes
	deserializedModel, err := DeserializeModel(bytes)

	if err != nil {
		t.Errorf("Error deserializing model: %v", err)
	}

	// Compare models
	serializedAgain, err := SerializeModel(deserializedModel)
	if err != nil {
		t.Errorf("Error serializing model: %v", err)
	}

	for i, b := range bytes {
		if b != serializedAgain[i] {
			t.Errorf("Byte %v does not match!\nOriginal: %v\nDeserialized: %v", i, model, deserializedModel)
		}
	}
}
