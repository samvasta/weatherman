package distributions

type Distribution interface {
	Sample() float64
}
