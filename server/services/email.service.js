const transporter = require('../config/nodemailer');
const sequelize = require('../config/db');
const { user } = sequelize.models;

class EmailService {
  //in Trading page
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

    console.log({email})
    return `Sended email to ${email}`;
  }

  //in Login, restore password
  async sendMailerPass(userId) {
    const findUserEmail = await user.findOne({
      where: { id: userId },
      attributes: ['email'],
    });
  
    const email = findUserEmail.email;
  
    const info = await transporter.sendMail({
      from: '"CryptoHill Simulator" <cryptohillsimulator@gmail.com>',
      to: email,
      subject: 'Change Password - CryptoHill Simulator',
      text: 'Click the following link to change your password: http://localhost:5173/restore-password',
      html: `
        <p>Hello,</p>
        <p>We received a request to reset your password.</p>
        <p>You can change it by clicking <a href="http://localhost:5173/restore-password" style="color:#7c3aed;text-decoration:none;">Here</a>.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
        <br/>
        <p>– The CryptoHill Team</p>
      `,
    });
  
    console.log({ email });
    return `Sent email to ${email}`;
  }
  
}

module.exports = new EmailService();
