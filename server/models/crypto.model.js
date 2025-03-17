const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'cryptocurrencies',
         {
            name: {
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
        }
    );
        sequelize.define(
            'purchases',
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull:false,
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                price_at_purchase: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            }
        );
        sequelize.define(
            'sales',
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull:false,
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                price_at_sale: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            }
        );
        sequelize.define(
            'portfolio',
            {
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                total_value: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            }
        );
} 