FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/otel.js ./otel.js
COPY --from=builder /app/node_modules/@opentelemetry ./node_modules/@opentelemetry
COPY --from=builder /app/node_modules/require-in-the-middle ./node_modules/require-in-the-middle
COPY --from=builder /app/node_modules/import-in-the-middle ./node_modules/import-in-the-middle
COPY --from=builder /app/node_modules/module-details-from-path ./node_modules/module-details-from-path
COPY --from=builder /app/node_modules/acorn ./node_modules/acorn
COPY --from=builder /app/node_modules/acorn-import-attributes ./node_modules/acorn-import-attributes
COPY --from=builder /app/node_modules/cjs-module-lexer ./node_modules/cjs-module-lexer
COPY --from=builder /app/node_modules/debug ./node_modules/debug
COPY --from=builder /app/node_modules/ms ./node_modules/ms

RUN mkdir -p .next/cache && chown -R appuser:appgroup .next

USER appuser

EXPOSE 3000

CMD ["node", "--require", "./otel.js", "server.js"]
