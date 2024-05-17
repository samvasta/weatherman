package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"samvasta.com/weatherman/app/serialize"
	"samvasta.com/weatherman/app/shared"
	"samvasta.com/weatherman/app/sim"

	_ "samvasta.com/weatherman/app/migrations"
)

var (
	//go:embed all:frontend/dist
	dist embed.FS
	//go:embed frontend/dist/index.html
	indexHTML     embed.FS
	distDirFS     = echo.MustSubFS(dist, "frontend/dist")
	distIndexHtml = echo.MustSubFS(indexHTML, "frontend/dist")
)

func main() {
	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.FileFS("/", "index.html", distIndexHtml)
		e.Router.StaticFS("/", distDirFS)

		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/simulate",
			Handler: func(c echo.Context) error {

				json_map := make(map[string]string)
				err := json.NewDecoder(c.Request().Body).Decode(&json_map)

				if err != nil {
					return c.String(http.StatusBadRequest, "bad request")
				}

				traceId := uuid.NewString()

				record, err := app.Dao().FindRecordById("models", json_map["modelId"])

				if err != nil {
					return c.String(http.StatusBadRequest, "model does not exist")
				}

				model := shared.NewModel()
				model.Iterations = record.GetInt("iterations")
				model.Steps = record.GetInt("steps")

				variables := make([](map[string]interface{}), 0)
				err = json.Unmarshal([]byte(record.GetString("variables")), &variables)

				if err != nil {
					return c.String(http.StatusBadRequest, "failed while parsing the variables")
				}

				for _, v := range variables {
					variable, err := serialize.DeserializeVariable(v)
					if err != nil {
						return c.String(http.StatusBadRequest, "failed while parsing model")
					}

					model.AddVariable(variable)
				}

				fmt.Printf("[%v] Handling simulate request for a model with %v variables and %v collectors. (Running %v steps at %v iterations).\n", traceId, len(model.AllVariables), len(model.AllCollectors()), model.Steps, model.Iterations)

				result := sim.MonteCarlo(&model, model.Steps, model.Iterations)

				resultMap := make(map[string]sim.CollectorStats)

				for _, collector := range model.AllCollectors() {
					resultMap[collector.Name] = result.GetStats(collector.Name)
				}

				return c.JSON(http.StatusOK, resultMap)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
