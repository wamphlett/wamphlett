import { registerOTel } from '@vercel/otel';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import logger from '@/lib/logger';

const otlpBase =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

try {
  registerOTel({
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: otlpBase + '/v1/metrics',
        }),
      }),
    ],
  });
  logger.info({ endpoint: otlpBase }, 'otel sdk started');
} catch (err) {
  logger.error({ err }, 'otel sdk failed to start');
}

process.on('unhandledRejection', err => {
  logger.error({ err }, 'unhandled rejection');
});

process.on('uncaughtException', err => {
  logger.fatal({ err }, 'uncaught exception');
});

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
// eslint-disable-next-line no-console
console.error = (...args: unknown[]) => {
  const first = args[0];
  if (first instanceof Error) {
    logger.error({ err: first }, first.message);
  } else {
    logger.error({ args }, 'console.error');
  }
  originalConsoleError(...args);
};
