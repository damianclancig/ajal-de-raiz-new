import 'server-only';
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    project: process.env.NEXT_PUBLIC_APP_NAME || 'ajal-de-raiz',
    env: process.env.NODE_ENV,
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
          },
        },
      }),
});
