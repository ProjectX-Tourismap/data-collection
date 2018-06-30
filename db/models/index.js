const fs = require('fs');
const path = require('path');
const debug = require('debug');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../config/database.js`)[env]; // eslint-disable-line
const db = {};


const logging = debug('Sequelize');
const assignConfig = Object.assign({
  logging,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
  },
}, config);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], assignConfig);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, assignConfig);
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
