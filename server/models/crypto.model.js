const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'crypto_coins',
        {
            coin_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            market_cap: {
                type: DataTypes.INTEGER,
                allowNull:false
            },
            price_change: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        sequelize.define(
            'user_coins',
            {
                coin_name: {
                    type: DataTypes.STRING,
                    allowNull:false,
                },
                value: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            }
        ),
        sequelize.define(
            'transactions',
            {
                order_type: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    validate: {
                        isIn: [['BUY', 'SELL']]
                    }
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            }
        )
    )

} 