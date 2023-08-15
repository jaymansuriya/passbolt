const { createLogger, transports, format } = require("winston");

const log = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.Console({
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
    }),
  ],
});

module.exports = log;