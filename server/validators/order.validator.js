const { body, query } = require('express-validator');

exports.placeOrder = [
  body('assetId')
    .trim()
    .isLength({ min: 3, max: 8 })
    .withMessage('assetId should be 3-8 letters')
    .escape(),
  body('amount').trim().isNumeric().withMessage('Amount should be number'),
  body('ord_direct')
    .trim()
    .notEmpty()
    .withMessage('order direction cannot be empty'),
  body('ord_type').trim().notEmpty().withMessage('order type cannot be empty'),
  body('price').trim().notEmpty().withMessage('price cannot be empty'),
  body('trigerPrice')
    .trim()
    .notEmpty()
    .withMessage('triger prices cannot be empty'),
  body('userId').trim().notEmpty().withMessage('user id cannot by empty'),
];

exports.updateOrder = [body('assetId').optional().trim()];
