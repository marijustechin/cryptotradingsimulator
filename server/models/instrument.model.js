const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.instrument = sequelize.define(
    'instrument',
    {
      id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
    }
  );
};
