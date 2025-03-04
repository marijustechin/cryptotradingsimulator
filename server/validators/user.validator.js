const { body } = require('express-validator');

exports.register = [
  body('first_name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      'First name should be at least 3 characters lenght, and max 30 characters'
    ),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid email characters'),
  body('password')
    .trim()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage(
      'Password must contain numbers, letters and must be minimum 6 characters length'
    ),
];

exports.login = [
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('password').trim(),
];
