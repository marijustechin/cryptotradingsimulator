function modelRelations(sequelize) {
  const {
    user,
    user_secret,
    token,
    wallet,
    portfolio,
    asset,
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

  asset.hasMany(transactions, { foreignKey: "asset_id", onDelete: "CASCADE" });
  transactions.belongsTo(asset, {
    foreignKey: "asset_id",
    onDelete: "CASCADE",
  });
  user.hasMany(transactions, { foreignKey: "user_id", onDelete: "CASCADE" });
  transactions.belongsTo(user, { foreignKey: "user_id", onDelete: "CASCADE" });
  user.hasMany(portfolio, { foreignKey: "user_id", onDelete: "CASCADE" });

  asset.hasMany(portfolio, { foreignKey: "asset_id", onDelete: "CASCADE" });
  asset.hasMany(transactions, { foreignKey: "asset_id", onDelete: "CASCADE" });
  transactions.belongsTo(asset, {
    foreignKey: "asset_id",
    onDelete: "CASCADE",
  });

  // assets
  asset.hasMany(asset_hist, {
    foreignKey: "asset_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  asset_hist.belongsTo(asset, { foreignKey: "asset_id" });
}

module.exports = { modelRelations };
