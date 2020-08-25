const express = require('express');

const db = require('./app/models');

const config = require('./config/config');

const app = express();

module.exports = require('./config/express')(app, config);

db.sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  }).catch((e) => {
    throw new Error(e);
  });

app.listen(config.info.port, () => {
  console.log(`${config.info.appName} listening on port ${config.info.port}`);
});
