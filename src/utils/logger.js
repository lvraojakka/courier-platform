//src/utils/logger.js
import fs from "fs";
import path from "path";
import winston from "winston";

// LOGS ROOT
const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// TODAY DATE
const today = new Date().toISOString().slice(0, 10);
const dailyDir = path.join(logsDir, today);

if (!fs.existsSync(dailyDir)) {
  fs.mkdirSync(dailyDir, { recursive: true });
}

// LOG FILE
const logFile = path.join(dailyDir, "application.log");

// CUSTOM FORMAT
const customFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

// LOGGER
const logger = winston.createLogger({
  level: "debug",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    customFormat
  ),

  transports: [
    new winston.transports.File({
      filename: logFile,
    }),

    // CONSOLE LOGGER
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        customFormat
      ),
    }),
  ],
});

export default logger;