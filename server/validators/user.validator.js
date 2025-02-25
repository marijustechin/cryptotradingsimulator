const { body } = require("express-validator");

exports.register = [
  body("first_name").trim(),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 32 })
    .withMessage("Password min length 6 characters"),
];

exports.login = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
];
