function modelRelations(sequelize) {
  const { user, user_secret, token, wallet, instrument, orders, userLogs } =
    sequelize.models;

  // --- User relations ---
  user.hasOne(user_secret, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  user_secret.belongsTo(user, { foreignKey: 'user_id' });

  user.hasOne(wallet, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  wallet.belongsTo(user, { foreignKey: 'user_id' });

  user.hasOne(token, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  token.belongsTo(user, { foreignKey: 'user_id' });

  user.hasMany(orders, { foreignKey: 'userId', onDelete: 'CASCADE' });
  orders.belongsTo(user, { foreignKey: 'userId' });

  user.hasMany(userLogs, { foreignKey: 'userId', onDelete: 'CASCADE' });
  userLogs.belongsTo(user, { foreignKey: 'userId' });

  // --- Instrument relations ---
  instrument.hasMany(orders, { foreignKey: 'assetId' });
  orders.belongsTo(instrument, { foreignKey: 'assetId' });
}

module.exports = { modelRelations };
