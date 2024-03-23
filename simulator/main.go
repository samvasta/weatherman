package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"slices"
	"time"

	"github.com/urfave/cli/v2"
	"samvasta.com/weatherman/simulator/distributions"
	"samvasta.com/weatherman/simulator/serialize"
	"samvasta.com/weatherman/simulator/server"
	"samvasta.com/weatherman/simulator/shared"
	"samvasta.com/weatherman/simulator/sim"
	"samvasta.com/weatherman/simulator/variables"
)

func main() {

	app := &cli.App{
		Commands: []*cli.Command{
			{
				Name:  "serve",
				Usage: "start a basic server to enable simulation over HTTP",
				Flags: []cli.Flag{
					&cli.IntFlag{
						Name:    "port",
						Aliases: []string{"p"},
						Usage:   "port to run the server on",
						Value:   8000,
					},
				},
				Action: func(cCtx *cli.Context) error {
					server.StartServer(cCtx.Int("port"))
					return nil
				},
			},
			{
				Name:  "simulate",
				Usage: "start a basic server to enable simulation over HTTP",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:  "path",
						Usage: "path to the model file to simulate",
					},
					&cli.IntFlag{
						Name:  "steps",
						Usage: "number of time steps to simulate",
						Value: 10,
					},
					&cli.IntFlag{
						Name:  "iter",
						Usage: "number of iterations to simulate",
						Value: 100,
					},
				},
				Action: func(cCtx *cli.Context) error {
					filePath := cCtx.String("path")
					model, err := serialize.ReadModelFromFile(filePath)
					if err != nil {
						return err
					}

					result := sim.MonteCarlo(model, min(cCtx.Int("steps"), 1000), min(cCtx.Int("iter"), 10_000))

					resultMap := make(map[string]sim.CollectorStats)

					for _, collector := range model.AllCollectors() {
						resultMap[collector.Name] = result.GetStats(collector.Name)
					}

					resultBytes, err := json.Marshal(resultMap)
					if err != nil {
						return err
					}

					fmt.Println(string(resultBytes))

					return nil
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}

	// start := time.Now()
	// TrySerialize()
	// TryDeserialize()
	// TestMC()

	// fmt.Println("That took", time.Since(start))
}

func TestMC() {

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

	result := sim.MonteCarlo(&model, 10, 100000)

	finalValues := make([]float64, len(result.Iterations))
	var totalDuration time.Duration
	for i, run := range result.Iterations {
		finalStep := run.Steps[len(run.Steps)-1]
		finalValues[i] = finalStep.Results["collector"]
		totalDuration += run.Duration
	}

	slices.Sort(finalValues)
	median := finalValues[len(finalValues)/2]

	avgDuration := float64(totalDuration) / float64(len(result.Iterations))

	fmt.Println("median was", median, "total compute time was", totalDuration, "avg duration was", time.Duration(int64(avgDuration)))
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

	two := variables.NewIVar("twoish", distributions.NewUniform(1.5, 2.5))

	finalValueSq := variables.NewPower("finalValueSq", "finalValue", "")

	collector := variables.NewCollector("collector", "finalValue")
	collector.Target = "initialPrinciple"

	model.AddVariable(initialPrinciple)
	model.AddVariable(contribution)
	model.AddVariable(returnOnInvestment)
	model.AddVariable(totalPrinciple)
	model.AddVariable(const1)
	model.AddVariable(roiMultiplier)
	model.AddVariable(finalValue)
	model.AddVariable(two)
	model.AddVariable(finalValueSq)

	model.AddVariable(collector)

	serialize.SaveModelToFile(&model, "test.json")
	fmt.Printf("%v\n", model)
}
