const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First name is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "This email already in use",
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email required",
        },
        notEmpty: {
          msg: "Email required",
        },
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
  }),
    sequelize.define(
      "user_secret",
      {
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "Password required",
            },
            notEmpty: {
              msg: "Password required",
            },
          },
        },
      },
      // nereikia automatiniu updated_at, created_at
      { timestamps: false }
    ),
    sequelize.define("token", {
      refreshToken: { type: DataTypes.TEXT, allowNull: false },
    });
};
