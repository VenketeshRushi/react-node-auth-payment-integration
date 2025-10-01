import winston from 'winston';
import 'winston-daily-rotate-file';
import { config } from '../config/config.js';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};
winston.addColors(logColors);

// Daily Rotate File transports
const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error/%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  zippedArchive: true,
});

const combinedTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/combined/%DATE%-combined.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const accessTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/access/%DATE%-access.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'http',
  zippedArchive: true,
});

export const logger = winston.createLogger({
  level: config.LOG_LEVEL, // use configured log level (defaults to 'info')
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [errorTransport, combinedTransport, accessTransport],
});

logger.add(
  new winston.transports.Console({
    level: config.LOG_LEVEL, // use configured log level
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`
      )
    ),
  })
);
