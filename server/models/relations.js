function modelRelations(sequelize) {
  const {
    user,
    user_secret,
    token,
    wallet,
    portfolio,
    cryptocurrencies,
    purchases,
    sales,
    asset,
    asset_hist,
  } = sequelize.models;

  // useris
  user.hasOne(user_secret, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  user.hasOne(wallet, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  user.hasOne(token, { foreignKey: 'user_id', onDelete: 'CASCADE' });

  user_secret.belongsTo(user, { foreignKey: 'user_id' });
  token.belongsTo(user, { foreignKey: 'user_id' });
  wallet.belongsTo(user, { foreignKey: 'user_id' });

  // crypto

  user.belongsToMany(cryptocurrencies, {
    through: portfolio,
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  cryptocurrencies.belongsToMany(user, {
    through: portfolio,
    foreignKey: 'crypto_id',
    onDelete: 'CASCADE',
  });

  purchases.belongsTo(user, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  purchases.belongsTo(cryptocurrencies, {
    foreignKey: 'crypto_id',
    onDelete: 'CASCADE',
  });
  sales.belongsTo(user, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  sales.belongsTo(cryptocurrencies, {
    foreignKey: 'crypto_id',
    onDelete: 'CASCADE',
  });

  user.hasMany(purchases, { foreignKey: 'user_id' });
  cryptocurrencies.hasMany(purchases, { foreignKey: 'crypto_id' });
  user.hasMany(sales, { foreignKey: 'user_id' });
  cryptocurrencies.hasMany(sales, { foreignKey: 'crypto_id' });

  // assets
  asset.hasMany(asset_hist, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  asset_hist.belongsTo(asset, { foreignKey: 'asset_id' });
}

module.exports = { modelRelations };
