export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { NodeSDK } = await import('@opentelemetry/sdk-node');
  const { OTLPTraceExporter } = await import(
    '@opentelemetry/exporter-trace-otlp-http'
  );
  const { getNodeAutoInstrumentations } = await import(
    '@opentelemetry/auto-instrumentations-node'
  );
  const { resourceFromAttributes } = await import('@opentelemetry/resources');
  const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = await import(
    '@opentelemetry/semantic-conventions'
  );

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'blog-site',
      [ATTR_SERVICE_VERSION]: process.env.APP_VERSION || 'unknown',
    }),
    traceExporter: new OTLPTraceExporter({
      url:
        (process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
          'http://localhost:4318') + '/v1/traces',
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  const { default: logger } = await import('@/lib/logger');

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
