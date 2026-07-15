# syntax=docker/dockerfile:1
# Build context MUST be the monorepo root:
#   docker build -f apps/home/Dockerfile -t <img> .
FROM node:22-alpine AS base
RUN corepack enable

FROM base AS pruner
WORKDIR /app
RUN npm i -g turbo@^2
COPY . .
RUN turbo prune @wamphlett/home --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@wamphlett/home

FROM base AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/apps/home/.next/standalone ./
COPY --from=builder /app/apps/home/.next/static ./apps/home/.next/static
COPY --from=builder /app/apps/home/public ./apps/home/public
RUN mkdir -p apps/home/.next/cache && chown -R appuser:appgroup apps/home/.next
USER appuser

ARG VERSION=unknown
ENV OTEL_RESOURCE_ATTRIBUTES=service.version=${VERSION}
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/home/server.js"]
