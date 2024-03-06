package sim

import (
	"slices"

	"samvasta.com/weatherman/simulator/variables"
)

func TopologicalSort(collectors []variables.Collector) []variables.Variable {
	allVars := []variables.Variable{}
	toVisit := []variables.Variable{}

	// Populate initial visit list
	for _, c := range collectors {
		toVisit = append(toVisit, c)
	}

	for len(toVisit) > 0 {
		// Pop the last element off the list
		current := toVisit[len(toVisit)-1]
		toVisit = toVisit[:len(toVisit)-1]

		// Add the current variable to the list
		allVars = append(allVars, current)

		// Add all the inputs of the current variable to the visit list
		for _, input := range current.Inputs() {

			matchingIdx := slices.IndexFunc(allVars, func(variable variables.Variable) bool {
				return variable.GetInfo().Name == input.GetInfo().Name
			})

			if matchingIdx != -1 {
				// Remove the matching input, it'll be added again later
				allVars = append(allVars[:matchingIdx], allVars[matchingIdx+1:]...)
			}

			toVisit = append(toVisit, input)
		}
	}

	slices.Reverse(allVars)
	return allVars
}
