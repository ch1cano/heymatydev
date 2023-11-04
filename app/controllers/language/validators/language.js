const { body } = require('express-validator')

exports.languageCreate = [
  body('name').notEmpty().withMessage('name is required!')
]

exports.languageUpdate = [
  body('name').notEmpty().withMessage('name is required!')
]
