const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.chart = sequelize.define(
    'chart',
    {
      symbol: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      interval: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      start: { type: DataTypes.BIGINT },
      open: { type: DataTypes.FLOAT },
      high: { type: DataTypes.FLOAT },
      low: { type: DataTypes.FLOAT },
      close: { type: DataTypes.FLOAT },
      volume: { type: DataTypes.FLOAT },
      end: { type: DataTypes.BIGINT },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
      indexes: [{ unique: true, fields: ['symbol', 'interval', 'start'] }],
    }
  );
};
