FROM node:22-slim AS base-fe
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./ /frontend
WORKDIR /frontend

FROM base-fe AS build-fe
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM lipanski/docker-static-website:latest

# Copy your static files
COPY --from=build-fe /frontend/dist .

CMD ["/busybox-httpd", "-f", "-v", "-p", "8091", "-c", "httpd.conf"]