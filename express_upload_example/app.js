/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const express = require('express');
const glob = require('glob');
const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(config.db, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongodb.then(() => {
  console.log('mongodb has been connected');
}).catch((err) => {
  console.log('mongodb connect err', err);
});

const models = glob.sync(`${config.root}/app/models/*.js`);
models.forEach((model) => {
  require(model);
});
const app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
