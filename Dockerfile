FROM node:22-slim AS base-fe
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./app/frontend /frontend
WORKDIR /frontend

FROM base-fe AS build-fe
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM golang:1.23-alpine AS base
COPY ./app /app
WORKDIR /app

FROM base AS build
RUN go mod tidy

FROM build AS build-exe
COPY --from=build-fe /frontend/dist /app/frontend/dist
RUN go build

FROM alpine:latest
COPY --from=build-exe /app/app /app/app

ARG PORT

ENV DEPLOY_COMMAND="/app/app serve --http=0.0.0.0:${PORT} --dir='/data/pb_data' --migrationsDir='/data/pb_migrations' --migrate"

EXPOSE ${PORT}

# start PocketBase
CMD $DEPLOY_COMMAND