import winston from "winston";
import config from "./config.js";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    http: "blue",
    debug: "white",
  },
};

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ level: "error", filename: "./errors.log" }),
  ],
});

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [new winston.transports.Console({ level: "debug" })],
});

export const addLogger = (req, res, next) => {
  req.logger = config.ENVIRONMENT === "PRODUCTION" ? prodLogger : devLogger;

  next();
};
