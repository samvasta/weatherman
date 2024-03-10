package main

import (
	"fmt"

	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/serialize"
	"samvasta.com/weatherman/simulator/shared"
	"samvasta.com/weatherman/simulator/variables"
)

func main() {
	TrySerialize()
	TryDeserialize()
}

func TryDeserialize() {
	if model, err := serialize.ReadModelFromFile("test.json"); err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("%v\n", model)
	}
}

func TrySerialize() {
	model := shared.NewModel()

	initialPrinciple := variables.NewIVar("initialPrinciple", distributions.NewConstant(1000))

	contribution := variables.NewIVar("contribution", distributions.NewConstant(100))

	returnOnInvestment := variables.NewIVar("returnOnInvestment", distributions.NewNormal(0.1, 0.05))

	totalPrinciple := variables.NewSum("totalPrinciple", []string{"initialPrinciple", "contribution"})

	const1 := variables.NewIVar("const1", distributions.NewConstant(1))

	roiMultiplier := variables.NewSum("roiMultiplier", []string{"returnOnInvestment", "const1"})

	finalValue := variables.NewProduct("finalValue", []string{"totalPrinciple", "roiMultiplier"})

	collector := variables.NewCollector("collector", "finalValue")
	collector.Target = "initialPrinciple"

	model.AddVariable(initialPrinciple)
	model.AddVariable(contribution)
	model.AddVariable(returnOnInvestment)
	model.AddVariable(totalPrinciple)
	model.AddVariable(const1)
	model.AddVariable(roiMultiplier)
	model.AddVariable(finalValue)
	model.AddVariable(collector)

	serialize.SaveModelToFile(&model, "test.json")
	fmt.Printf("%v\n", model)
}
