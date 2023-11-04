const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates update item request
 */
const validateUpdateUser1 = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('age')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  // check('description')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateUpdateUser1 }
