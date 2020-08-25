const logger = require('fluent-logger');

logger.configure('fluentd.test', { // NOTE: 태그.
  host: 'localhost',
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000, // 10 minutes
});

logger.emit('join', {id: 'a', name: 'delryn', age: 32});