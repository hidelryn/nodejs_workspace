
/* eslint-disable global-require */

const express = require('express');
const glob = require('glob');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compress = require('compression');
const passport = require('passport');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

module.exports = (app, config) => {
  app.set('views', `${config.root}/app/view`);
  app.set('view engine', 'ejs');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(session({
    secret: 'hi?delryn',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redis.createClient(config.redis),
      host: config.redis.host,
      port: config.redis.port,
      prefix: 'session:',
      db: 0,
    }),
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
  const controllers = glob.sync(`${config.root}/app/controller/*.js`);
  controllers.forEach((controller) => {
    // eslint-disable-next-line import/no-dynamic-require
    require(controller)(app);
  });
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error',
      });
    });
  } else {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error',
      });
    });
  }

  return app;
};
