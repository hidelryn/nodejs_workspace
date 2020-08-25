/* eslint-disable global-require */
const glob = require('glob');
const bodyParser = require('body-parser');

module.exports = (app, config) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  const controllers = glob.sync(`${config.info.root}/app/controllers/*.js`);
  controllers.forEach((controller) => {
    // eslint-disable-next-line import/no-dynamic-require
    require(controller)(app);
  });
  return app;
};
