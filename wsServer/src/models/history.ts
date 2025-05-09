// src/models/history.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export const History = sequelize.define(
  'history',
  {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_interval: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    open: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    high: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    low: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    close: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    start: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    end: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: 'histories',
    timestamps: false,
  }
);
