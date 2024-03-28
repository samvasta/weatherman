package serialize

import (
	"testing"

	"samvasta.com/weatherman/app/distributions"
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/variables"
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

func TestDeserialize(t *testing.T) {
	str := `{"variables":[{"name":"initialPrinciple","description":"","units":"","type":"ivar","distribution":{"type":"constant","value":1000}},{"name":"contribution","description":"","units":"","type":"ivar","distribution":{"type":"constant","value":100}},{"name":"returnOnInvestment","description":"","units":"","type":"ivar","distribution":{"type":"normal","mean":0.1,"stdDev":0.05}},{"name":"totalPrinciple","description":"","units":"","type":"sum","inputs":["initialPrinciple","contribution"]},{"name":"const1","description":"","units":"","type":"ivar","distribution":{"type":"constant","value":1}},{"name":"roiMultiplier","description":"","units":"","type":"sum","inputs":["returnOnInvestment","const1"]},{"name":"finalValue","description":"","units":"","type":"product","inputs":["totalPrinciple","roiMultiplier"]},{"name":"twoish","description":"","units":"","type":"ivar","distribution":{"type":"uniform","min":1.5,"max":2.5}, "ui": {"x":123, "y": 23, "id": "abcde"}},{"name":"finalValueSq","description":"","units":"","type":"power","base":"finalValue","exponent":""},{"name":"collector","description":"","units":"","type":"collector","input":"finalValue","target":"initialPrinciple"}]}`

	_, err := DeserializeModel([]byte(str))

	if err != nil {
		t.Error(err)
	}

}
