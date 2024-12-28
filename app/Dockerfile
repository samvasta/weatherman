FROM golang:1.23-alpine AS base

COPY ./ /app
WORKDIR /app

RUN go mod tidy
RUN go build

FROM alpine:latest
COPY --from=base /app/app /app

ARG PORT

ENV DEPLOY_COMMAND="/app serve --http=0.0.0.0:${PORT} --migrate"

EXPOSE ${PORT}

# start PocketBase
CMD $DEPLOY_COMMAND