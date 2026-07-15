import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: 'wamphlett',
    env: process.env.NODE_ENV,
  },
  formatters: {
    level: label => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
