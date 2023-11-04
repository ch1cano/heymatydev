const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')
const moment = require('moment')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 * @param {String} role - user role
 */
const registerUser = (req = {}, role = 'user') => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      verification: uuid.v4(),
      emailConfirmationCode: uuid.v4(),
      emailConfirmationValidUntil: moment().add(10, 'years').toDate(),
      emailConfirmationRequestedAt: moment(),
      role
    })
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

module.exports = { registerUser }
