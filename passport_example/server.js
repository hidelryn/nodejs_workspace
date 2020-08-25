/* eslint-disable global-require */

const express = require('express');

const mongoose = require('mongoose');

const glob = require('glob');

const config = require('./config/config');

const app = express();

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongodb.then(() => {
  // eslint-disable-next-line no-console
  console.log('mongodb has been connected');
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.log('mongodb connect err', err);
});

const models = glob.sync(`${config.root}/app/model/*.js`);
models.forEach((model) => {
  // eslint-disable-next-line import/no-dynamic-require
  require(model);
});

module.exports = require('./config/express')(app, config);


app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.appName} listening on port ${config.port}`);
});
