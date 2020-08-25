const { createLogger, format, transports } = require('winston');
const fluentTransport = require('fluent-logger').support.winstonTransport();
const mt = require('moment-timezone');

const { combine, label, printf } = format;

const date = mt().tz('Asia/Seoul');
const myFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);
const koreaTime = format((info) => {
  info.timestamp = date.format();
  return info;
});

const fluentConfig = {
  host: 'localhost',
  port: 24224,
  timeout: 3.0,
  requireAckResponse: false,
};

const fluentInit = (tag) => {
  const init = new fluentTransport(tag, fluentConfig);
  return init;
}

const appLogger = (category) => {
  const init = createLogger({
    format: combine(
      label({ label: category }),
      koreaTime(),
      myFormat,
    ),
    transports: [fluentInit('myproject.app')],
  });
  return init;
};

const httpLogger = createLogger({
  format: combine(
    label({ label: 'http' }),
    koreaTime(),
    myFormat,
  ),
  transports: [fluentInit('myproject.http')],
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