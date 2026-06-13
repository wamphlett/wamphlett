import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: 'wamphlett',
    env: process.env.NODE_ENV,
  },
});

export default logger;
