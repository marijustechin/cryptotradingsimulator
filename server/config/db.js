const { Sequelize } = require('sequelize');
const { modelRelations } = require('../models/relations');
const userDefiner = require('../models/user.model');
const cryptoDefiner = require('../models/crypto.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

const allModels = [userDefiner, cryptoDefiner];

for (const modelDefiner of allModels) {
  modelDefiner(sequelize);
}

modelRelations(sequelize);

module.exports = sequelize;
