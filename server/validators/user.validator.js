const { body } = require('express-validator');

exports.register = [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage(
      'First name should be at least 2 characters long and a maximum of 30 characters.'
    ),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    // vardo dalyje leidziami simboliai
    // raides, skaiciai, taskas, pabraukimas ir bruksnelis
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
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

exports.updateUser = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage(
      'First name should be at least 2 characters long and a maximum of 30 characters.'
    ),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage(
      'First name should be at least 2 characters long and a maximum of 30 characters.'
    ),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Invalid email characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage(
      'Address should be at least 5 characters length, and max 100 characters'
    ),
  body('phone_number')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Invalid phone number format. Example: 37012345678')
    .isLength({ min: 11, max: 11 })
    .withMessage('Phone number should be 11 characters length'),
];
