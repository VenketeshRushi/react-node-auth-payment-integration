import winston from 'winston';

export const logLevels = {
  error: 0,
  warn: 1,
  http: 2,
  info: 3,
  debug: 4,
} as const;

export type LogLevel = keyof typeof logLevels;

export const logColors: Record<LogLevel, string> = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  debug: 'blue',
};

winston.addColors(logColors);
