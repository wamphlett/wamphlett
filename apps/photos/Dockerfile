# syntax=docker/dockerfile:1
# Build context MUST be the monorepo root:
#   docker build -f apps/photos/Dockerfile -t <img> .
FROM node:22-alpine AS base
RUN corepack enable

FROM base AS pruner
WORKDIR /app
RUN npm i -g turbo@^2
COPY . .
RUN turbo prune @wamphlett/photos --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@wamphlett/photos

FROM base AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/apps/photos/.next/standalone ./
COPY --from=builder /app/apps/photos/.next/static ./apps/photos/.next/static
COPY --from=builder /app/apps/photos/public ./apps/photos/public
# Next's file tracer drops sharp's native libvips binary from the standalone
# output (it can't see dlopen'd files via static analysis, and pnpm's nested
# virtual store makes overlaying the traced copy fragile) — install a plain,
# platform-correct sharp directly at the tree root so require('sharp') from
# anywhere under /app resolves it via normal upward node_modules lookup.
RUN npm install --no-save --omit=dev sharp@^0.35.1
RUN mkdir -p apps/photos/.next/cache && chown -R appuser:appgroup apps/photos/.next
USER appuser

ARG VERSION=unknown
ENV OTEL_RESOURCE_ATTRIBUTES=service.version=${VERSION}
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/photos/server.js"]
