const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates update profile request
 */
const updateInfo = [
  // check('age')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY'),
  // check('services').exists().withMessage('MISSING'),
  check('languages').exists().withMessage('MISSING'),
  // check('country')
  //   .exists()
  //   .withMessage('MISSING'),
  // check('state')
  //   .exists()
  //   .withMessage('MISSING'),
  // check('city')
  //   .exists()
  //   .withMessage('MISSING'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { updateInfo }
