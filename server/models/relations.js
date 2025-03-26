function modelRelations(sequelize) {
  const {
    user,
    user_secret,
    token,
    wallet,
    portfolio,
    asset,
    instrument,
    asset_hist,
    transactions,
  } = sequelize.models;

  // useris
  user.hasOne(user_secret, { foreignKey: "user_id", onDelete: "CASCADE" });
  user.hasOne(wallet, { foreignKey: "user_id", onDelete: "CASCADE" });
  user.hasOne(token, { foreignKey: "user_id", onDelete: "CASCADE" });

  user_secret.belongsTo(user, { foreignKey: "user_id" });
  token.belongsTo(user, { foreignKey: "user_id" });
  wallet.belongsTo(user, { foreignKey: "user_id" });

  // crypto

  instrument.hasMany(transactions, {
    foreignKey: "asset_id",
    sourceKey: "id",
  });
  
  transactions.belongsTo(instrument, {
    foreignKey: "asset_id",
    targetKey: "id",
    as: "instrument",
  });
  
  user.hasMany(transactions, { foreignKey: "user_id", onDelete: "CASCADE" });
  user.hasMany(portfolio, { foreignKey: "user_id", onDelete: "CASCADE" });

  portfolio.belongsTo(instrument, { foreignKey: "asset_id", as: "instrument" });
  instrument.hasMany(portfolio, { foreignKey: "asset_id", onDelete: "CASCADE" });
  

  asset.hasMany(portfolio, { foreignKey: "asset_id", onDelete: "CASCADE" });
  asset.hasMany(transactions, { foreignKey: "asset_id", onDelete: "CASCADE" });

  // assets
  asset.hasMany(asset_hist, {
    foreignKey: "asset_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  asset_hist.belongsTo(asset, { foreignKey: "asset_id" });
}

module.exports = { modelRelations };
