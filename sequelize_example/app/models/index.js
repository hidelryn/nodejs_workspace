
// sequelize init

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config/config');

const db = {};

const sequelize = new Sequelize(config.info.mysql); // NOTE: mysql connect url

fs.readdirSync(__dirname).filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op; // NOTE: v5부턴 이걸 해줘야 조건절 equal같은거 쓸수 잇음.

module.exports = db;
