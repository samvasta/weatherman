FROM golang:1.23-alpine AS base

COPY ./ /app
WORKDIR /app

RUN go mod tidy
RUN go build

FROM alpine:latest
COPY --from=base /app/app /app

# start PocketBase
CMD ["/app", "serve", "--http=0.0.0.0:8090", "--migrate"]