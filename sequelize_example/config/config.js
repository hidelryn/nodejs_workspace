
const path = require('path');

const ROOT = path.dirname(require.main.filename);

const ENV = process.env.NODE_ENV || 'local';

const config = {
  local: {
    root: ROOT,
    appName: 'local-server',
    port: process.env.PORT || 3000,
    mysql: 'mysql://root@localhost/test',
  },
  development: {
    root: ROOT,
    appName: 'dev-server',
    port: process.env.PORT || 3000,
    mysql: '',
  },
  staging: {
    root: ROOT,
    appName: 'staging-server',
    port: process.env.PORT || 3000,
    mysql: '',
  },
  production: {
    root: ROOT,
    appName: 'production-server',
    port: process.env.PORT || 3000,
    mysql: '',
  },
};

exports.ENV = ENV;
exports.info = config[ENV];
