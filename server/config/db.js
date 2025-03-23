const { Sequelize } = require('sequelize');
const { modelRelations } = require('../models/relations');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 10, // Max prisijungimai
      min: 2, // Min prisijungimai
      idle: 10000, // Uzdarom prisijungimus po 10 sek
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

const allModels = [
  require('../models/user.model'),
  require('../models/portfolio.model'),
  require('../models/asset.model'),
  require('../models/instrument.model'),
];

for (const modelDefiner of allModels) {
  modelDefiner(sequelize);
}

modelRelations(sequelize);

module.exports = sequelize;
