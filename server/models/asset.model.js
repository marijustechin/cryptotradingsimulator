const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.models.asset = sequelize.define(
    'asset',
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      rank: {
        type: DataTypes.INTEGER,
      },
      symbol: {
        type: DataTypes.STRING(10),
      },
      name: {
        type: DataTypes.STRING(30),
      },
      supply: {
        type: DataTypes.BIGINT,
      },

      marketCapUsd: {
        type: DataTypes.FLOAT,
      },
      volumeUsd24Hr: {
        type: DataTypes.FLOAT,
      },

      priceUsd: {
        type: DataTypes.DECIMAL(10, 2),
      },

      changePercent24Hr: {
        type: DataTypes.DECIMAL(10, 3),
      },

      vwap24Hr: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
    }
  );
  sequelize.models.asset_hist = sequelize.define(
    'asset_hist',
    {
      asset_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
          model: 'assets',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      priceUsd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
      indexes: [
        { unique: true, fields: ['asset_id', 'date'] }, // apsaugo nuo dvigubu irasu pagal data
        { fields: ['priceUsd'] }, // optimizuotos kainos uzklausos
      ],
    }
  );
};
