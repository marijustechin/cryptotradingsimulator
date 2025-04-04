const nodemailer = require("nodemailer");
const env = require('dotenv');
env.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  },
});

module.exports = transporter;