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

VOLUME /app/pb_data

ENV port 8080

EXPOSE ${port}

# start PocketBase
CMD ["/app/app", "serve", "--http=0.0.0.0:${port}", "--migrate"]