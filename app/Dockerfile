FROM golang:1.23-alpine AS base

COPY ./app /app
WORKDIR /app

RUN go mod tidy
RUN go build

FROM alpine:latest
COPY --from=build-exe /app/app /app/app

ARG PORT

ENV DEPLOY_COMMAND="/app/app serve --http=0.0.0.0:${PORT} --migrate"

EXPOSE ${PORT}

# start PocketBase
CMD $DEPLOY_COMMAND