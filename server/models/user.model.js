const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // user model
  sequelize.models.user = sequelize.define('user', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'This email already in use',
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email required',
        },
        notEmpty: {
          msg: 'Email required',
        },
        isEmail: {
          msg: 'Invalid email format',
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
      type: DataTypes.ENUM('USER', 'ADMIN'),
      defaultValue: 'USER',
    },
  });
  sequelize.models.user_secret = sequelize.define(
    'user_secret',
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password required',
          },
          notEmpty: {
            msg: 'Password required',
          },
        },
      },
    },
    {
      // nereikia automatiniu updated_at, created_at
      timestamps: false,
      // sitas hookas "automatiskai" hashina slaptazodi
      // pagal geros praktikos taisykles
      // jis atskirtas nuo visos serviso logikos

      hooks: {
        beforeCreate: async (userSecret) => {
          userSecret.password = await bcrypt.hash(userSecret.password, 10);
        },
        beforeUpdate: async (userSecret) => {
          if (userSecret.changed('password')) {
            userSecret.password = await bcrypt.hash(userSecret.password, 10);
          }
        },
      },
    }
  );

  // wallet model
  sequelize.models.wallet = sequelize.define(
    'wallet',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      balance: {
        type: DataTypes.FLOAT,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // user Borrow model
  sequelize.models.borrow = sequelize.define('borrow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // token model
  sequelize.models.token = sequelize.define('token', {
    refreshToken: { type: DataTypes.TEXT, allowNull: false },
  });
};
