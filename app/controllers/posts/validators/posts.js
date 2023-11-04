const { body } = require('express-validator')

exports.createPost = [
  body('title').notEmpty().withMessage('title is required!'),
  body('description').notEmpty().withMessage('description is required!'),
  body('isPublic').notEmpty().withMessage('isPublic is required!')
]

exports.validateUpdateUser = [
  body('title').notEmpty().withMessage('title is required!'),
  body('description').notEmpty().withMessage('description is required!')
]
