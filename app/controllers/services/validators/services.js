const { body } = require('express-validator')

exports.serviceCreate = [
  body('name').notEmpty().withMessage('name is required!')
]

exports.serviceUpdate = [
  body('name').notEmpty().withMessage('name is required!')
]
