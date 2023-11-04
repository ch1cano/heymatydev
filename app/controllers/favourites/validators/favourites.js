const { body } = require('express-validator')

exports.createFavourite = [
  body('modelId').notEmpty().withMessage('modelId is required!')
]
