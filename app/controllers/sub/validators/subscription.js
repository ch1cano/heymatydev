const { body } = require('express-validator')

exports.createSubScription = [
  body('tariffId').notEmpty().withMessage('tariffId is required!'),
  body('days').notEmpty().withMessage('days is required!')
]
