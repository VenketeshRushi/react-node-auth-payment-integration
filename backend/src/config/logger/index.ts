import winston from 'winston';
import { config } from '../loadEnv.js';
import { logLevels } from './levels.js';
import { fileFormat } from './formats.js';
import { fileTransports, createConsoleTransport } from './transports.js';

const transports: winston.transport[] = [...fileTransports];

if (config.NODE_ENV !== 'production') {
  transports.push(createConsoleTransport());
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  levels: logLevels,
  format: fileFormat,
  transports,
});
