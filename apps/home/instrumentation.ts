export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { default: logger } = await import('@/lib/logger');

  process.on('unhandledRejection', err => {
    logger.error({ err }, 'unhandled rejection');
  });

  process.on('uncaughtException', err => {
    logger.fatal({ err }, 'uncaught exception');
  });

  // Intercept console.error to capture Next.js internal SSR/RSC errors
  /* eslint-disable no-console */
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
