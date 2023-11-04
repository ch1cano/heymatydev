const { body } = require('express-validator')

exports.age = [body('age').notEmpty().withMessage('age is required!')]

exports.country = [
  body('country').notEmpty().withMessage('country is required!')
]

exports.city = [body('city').notEmpty().withMessage('city is required!')]

exports.state = [body('state').notEmpty().withMessage('state is required!')]

exports.pricePerDay = [
  body('price').notEmpty().withMessage('price is required!')
]

exports.createModel = [
  body('name').notEmpty().withMessage('name is required!'),
  body('email')
    .notEmpty()
    .withMessage('email is required!')
    .isEmail()
    .withMessage('email must be in correct format'),
  body('password').notEmpty().withMessage('password is required!'),
  body('age').notEmpty().withMessage('age is required!'),
  body('pricePerDay').notEmpty().withMessage('pricePerDay is required!'),
  body('country').notEmpty().withMessage('Country is required!'),
  body('state').notEmpty().withMessage('State is required!'),
  body('city').notEmpty().withMessage('City is required!')
]
