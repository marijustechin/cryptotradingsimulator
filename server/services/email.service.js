const transporter = require('../config/nodemailer');
const sequelize = require('../config/db');
const { user } = sequelize.models;

class EmailService {
  async sendMailer(userId) {
    const findUserEmail = await user.findOne({
      where: { id: userId },
      attributes: ['email'],
    });

    const email = findUserEmail.email;

    const info = await transporter.sendMail({
      from: '"CryptoHill Simulator" <cryptohillsimulator@gmail.com>',
      to: email,
      subject: 'Your order has been executed - CryptoHill Simulator',
      text: 'Hello, your order has been successfully filled!',
      html: '<b>Hello, your order has been successfully filled!</b>',
    });

    return `Sended email to ${email}`;
  }
}

module.exports = new EmailService();
