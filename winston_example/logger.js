const { createLogger, format, transports } = require('winston');
const { combine, label, printf } = format;
const path = require('path');
const mt = require('moment-timezone');

const date = mt().tz('Asia/Seoul');
const myFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);
const koreaTime = format((info) => {
  info.timestamp = date.format();
  return info;
});

const logType = {
  1: 'join',
  2: 'login',
  3: 'spend_item',
  4: 'system',
};

const appLogger = (type) => {
  const init = createLogger({
    format: combine(
      label({ label: logType[type] }),
      koreaTime(),
      myFormat,
    ),
    transports: [
      new transports.File({ filename: path.join(__dirname, 'logs', 'app-error.log'), level: 'error' }),
      new transports.File({ filename: path.join(__dirname, `logs`, date.format('YYYY-MM-DD'), 'app.log') }),
    ],
  });
  if (process.env.NODE_ENV !== 'production') {
    init.add(new transports.Console());
  }
  return init;
};

const httpLogger = createLogger({
  format: combine(
    label({ label: 'http' }),
    koreaTime(),
    myFormat,
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, 'logs', date.format('YYYY-MM-DD'), 'http.log') }),
  ],
});

const httpLogStream = {
  write: (message) => {
    httpLogger.log({
      level: 'info',
      message: message,
    });
  },
};

exports.appLogger = appLogger;
exports.httpLogStream = httpLogStream;