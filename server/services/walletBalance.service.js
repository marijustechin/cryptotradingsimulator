const sequelize = require('../config/db');
const { orders, wallet } = sequelize.models;

class WalletBalanceService {
  /**
   * Recalculates and updates the user's wallet balance
   * @param {number|string} userId
   */
  async recalculateUserBalance(userId) {
    const userOrders = await orders.findAll({
      where: { userId },
      raw: true,
    });

    let newBalance = 10000;

    for (const order of userOrders) {
      const amount = parseFloat(order.amount || 0);
      const price = parseFloat(order.price || 0);
      const triggerPrice = parseFloat(order.triggerPrice || 0);

      if (order.closed_date) {
        if (order.ord_direct === 'sell') {
          newBalance += amount * price;
        } else if (order.ord_direct === 'buy') {
          newBalance -= amount * price;
        }
      } else {
        if (order.ord_direct === 'buy') {
          newBalance -= amount * triggerPrice;
        }
        // Note: open sell orders don't affect balance
      }
    }

    // Find wallet and update balance
    const userWallet = await wallet.findOne({ where: { user_id: userId } });
    if (!userWallet) {
      throw new Error('Wallet not found for user');
    }

    userWallet.balance = parseFloat(newBalance.toFixed(5));
    await userWallet.save();
  }
}

module.exports = new WalletBalanceService();
