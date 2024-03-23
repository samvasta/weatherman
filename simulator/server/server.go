package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"samvasta.com/weatherman/simulator/serialize"
	"samvasta.com/weatherman/simulator/sim"
)

type BodyData struct {
	Iterations int             `json:"iterations"`
	Steps      int             `json:"steps"`
	RawModel   json.RawMessage `json:"model"`
}

func HandleSimulate(w http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()

	start := time.Now()

	traceId := uuid.NewString()

	body, err := io.ReadAll(req.Body)

	if err != nil {
		http.Error(w, "Could not read body", http.StatusBadRequest)
		return
	}

	var data BodyData

	err = json.Unmarshal(body, &data)

	if err != nil {
		http.Error(w, "Invalid body format", http.StatusBadRequest)
		return
	}

	model, err := serialize.DeserializeModel(data.RawModel)

	if err != nil {
		http.Error(w, "Invalid model format", http.StatusBadRequest)
		return
	}

	if data.Iterations > 10_000 {
		data.Iterations = 10_000
	}
	if data.Steps > 1_000 {
		data.Steps = 1_000
	}

	fmt.Printf("[%v] Handling simulate request for a model with %v variables and %v collectors. (Running %v steps at %v iterations).\n", traceId, len(model.AllVariables), len(model.AllCollectors()), data.Steps, data.Iterations)

	result := sim.MonteCarlo(model, data.Steps, data.Iterations)

	resultMap := make(map[string]sim.CollectorStats)

	for _, collector := range model.AllCollectors() {
		resultMap[collector.Name] = result.GetStats(collector.Name)
	}

	resultMapBytes, err := json.Marshal(resultMap)

	if err != nil {
		http.Error(w, "Error collecting results", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resultMapBytes)

	fmt.Printf("[%v] Successfully completed simulation request. (took %v)\n", traceId, time.Since(start))
}

func StartServer(port int) {
	http.HandleFunc("/simulate", HandleSimulate)

	fmt.Println("Starting weatherman server. Listening on port", port)
	http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
}
