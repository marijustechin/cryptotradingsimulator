function modelRelations(sequelize) {
  const { user, user_secret, token } = sequelize.models;

  // useris
  user.hasOne(user_secret, { foreignKey: "user_id", onDelete: "CASCADE" });
  user.hasOne(token, { foreignKey: "user_id", onDelete: "CASCADE" });

  user_secret.belongsTo(user, { foreignKey: "user_id" });
  token.belongsTo(user, { foreignKey: "user_id" });
}

module.exports = { modelRelations };
