FROM node:22-slim AS base-fe
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./ /frontend
WORKDIR /frontend

FROM base-fe AS build-fe
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:stable-alpine
COPY --from=build-fe /frontend/dist /usr/share/nginx/html