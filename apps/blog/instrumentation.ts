export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { NodeSDK } = await import('@opentelemetry/sdk-node');
  const { OTLPTraceExporter } = await import(
    '@opentelemetry/exporter-trace-otlp-http'
  );
  const { OTLPMetricExporter } = await import(
    '@opentelemetry/exporter-metrics-otlp-http'
  );
  const { PeriodicExportingMetricReader } = await import(
    '@opentelemetry/sdk-metrics'
  );
  const { getNodeAutoInstrumentations } = await import(
    '@opentelemetry/auto-instrumentations-node'
  );
  const otlpBase =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: otlpBase + '/v1/traces',
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: otlpBase + '/v1/metrics',
      }),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  const { default: logger } = await import('@/lib/logger');

  logger.info(
    { endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318' },
    'otel sdk started',
  );

  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'unhandled rejection');
  });

  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'uncaught exception');
  });

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (first instanceof Error) {
      logger.error({ err: first }, first.message);
    } else {
      logger.error({ args }, 'console.error');
    }
    originalConsoleError(...args);
  };
}
