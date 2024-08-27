import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { environment, logDirectory } from '../../Config';

let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = environment === 'development' ? 'debug' : 'warn';

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  // @ts-ignore
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.json(),
  ),
});

export default createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf(({ timestamp, level, message, stack }) => {
      const text = `${timestamp} ${level.toUpperCase()} ${message}`;
      return stack ? text + '\n' + stack : text;
    }),
  ),
  transports: [new transports.Console(), dailyRotateFile],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false, // do not exit
});
