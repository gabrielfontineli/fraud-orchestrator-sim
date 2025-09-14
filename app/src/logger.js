const pino = require('pino');

// chaves curtas e sem ruído; em dev, usa pino-pretty, em prod JSON
const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      singleLine: true,
      messageFormat: '{msg} | evt:{evt} rid:{rid} decision:{decision} t_ms:{t_ms} total:{total_ms}'
    }
  }
});

module.exports = logger;