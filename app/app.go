package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"samvasta.com/weatherman/app/serialize"
	"samvasta.com/weatherman/app/shared"
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

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type BodyData struct {
	Iterations int             `json:"iterations"`
	Steps      int             `json:"steps"`
	RawModel   json.RawMessage `json:"model"`
}

func (a *App) LoadFile() error {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})

	if err != nil {
		return err
	}

	fileContents, err := os.ReadFile(path)

	if err != nil {
		return err
	}

	var data BodyData

	err = json.Unmarshal(fileContents, &data)

	if err != nil {
		return err
	}

	model, err := serialize.DeserializeModel(data.RawModel)

	if err != nil {
		return err
	}

	a.Model = model
	a.CurrentFilePath = path

	return nil
}

func (a *App) SaveFileAs() error {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{})

	if err != nil {
		return err
	}

	bytes, err := serialize.SerializeModel(a.Model)

	if err != nil {
		return err
	}

	err = os.WriteFile(path, bytes, os.ModeAppend)

	if err != nil {
		return err
	}

	a.CurrentFilePath = path

	return nil
}

func (a *App) SaveFile() error {

	bytes, err := serialize.SerializeModel(a.Model)

	if err != nil {
		return err
	}

	err = os.WriteFile(a.CurrentFilePath, bytes, os.ModeAppend)

	if err != nil {
		return err
	}

	return nil
}
