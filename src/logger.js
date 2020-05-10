import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logger = createLogger({
  format: combine(
    timestamp(),
    printf((log) => `[${log.timestamp}] ${log.level}: ${log.message}`),
  ),
  transports: [
    new transports.Console(),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
});

export default logger;
