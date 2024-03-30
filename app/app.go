package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"samvasta.com/weatherman/app/serialize"
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/sim"
)

// App struct
type App struct {
	ctx             context.Context
	CurrentFilePath string
	Model           *shared.Model
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
	runtime.WindowSetBackgroundColour(a.ctx, 252, 251, 248, 255)
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

type BodyData struct {
	Model json.RawMessage `json:"model"`
}

func (a *App) LoadFile() shared.Model {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})

	if err != nil {
		return shared.NewModel()
	}

	fileContents, err := os.ReadFile(path)

	if err != nil {
		return shared.NewModel()
	}

	var data json.RawMessage

	err = json.Unmarshal(fileContents, &data)

	if err != nil {
		return shared.NewModel()
	}

	model, err := serialize.DeserializeModel(data)

	if err != nil {
		return shared.NewModel()
	}

	a.Model = model
	a.CurrentFilePath = path

	return *a.Model
}

func (a *App) ClearModel() {
	a.Model = &shared.Model{}
	a.CurrentFilePath = ""
}

func (a *App) SaveFileAs() error {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: "model.json",
		Title:           "Save Model",
	})

	if err != nil {
		return err
	}

	bytes, err := serialize.SerializeModel(a.Model)

	if err != nil {
		return err
	}

	err = os.WriteFile(path, bytes, 0644)

	if err != nil {
		return err
	}

	a.CurrentFilePath = path

	return nil
}

func (a *App) SaveFile() error {

	if a.CurrentFilePath == "" {
		return a.SaveFileAs()
	}

	bytes, err := serialize.SerializeModel(a.Model)

	if err != nil {
		return err
	}

	err = os.WriteFile(a.CurrentFilePath, bytes, 0644)

	if err != nil {
		return err
	}

	return nil
}

func (a *App) OnModelUpdated(body json.RawMessage) {

	model, err := serialize.DeserializeModel(body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("BODY", string(body))
	fmt.Println("COMPILED", a.Model)
	a.Model = model
}

func (a *App) Simulate(iterations, steps int) map[string]sim.CollectorStats {
	if a.Model == nil {
		return make(map[string]sim.CollectorStats)
	}

	result := sim.MonteCarlo(a.Model, steps, iterations)

	resultMap := make(map[string]sim.CollectorStats)

	for _, collector := range a.Model.AllCollectors() {
		resultMap[collector.Name] = result.GetStats(collector.Name)
	}

	return resultMap
}
