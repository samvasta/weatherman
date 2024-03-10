package sim

import (
	"slices"

	"samvasta.com/weatherman/simulator/variables"
)

func TopologicalSort(collectors []variables.Collector, allVariables map[string]variables.Variable) []variables.Variable {
	allVars := []variables.Variable{}
	toVisitNames := []string{}

	// Populate initial visit list
	for _, c := range collectors {
		toVisitNames = append(toVisitNames, c.Name)
	}

	for len(toVisitNames) > 0 {
		// Pop the last element off the list
		currentName := toVisitNames[len(toVisitNames)-1]
		toVisitNames = toVisitNames[:len(toVisitNames)-1]

		current, ok := allVariables[currentName]
		if !ok {
			panic("Variable not found: " + currentName)
		}

		// Add the current variable to the list
		allVars = append(allVars, current)

		// Add all the inputs of the current variable to the visit list
		for _, input := range current.GetInputs() {

			matchingIdx := slices.IndexFunc(allVars, func(variable variables.Variable) bool {
				return variable.GetInfo().Name == input
			})

			if matchingIdx != -1 {
				// Remove the matching input, it'll be added again later
				allVars = append(allVars[:matchingIdx], allVars[matchingIdx+1:]...)
			}

			toVisitNames = append(toVisitNames, input)
		}
	}

	slices.Reverse(allVars)
	return allVars
}
