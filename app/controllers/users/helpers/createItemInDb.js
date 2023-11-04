const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')
const moment = require('moment')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItemInDb = ({
  name = '',
  email = '',
  password = '',
  role = '',
  phone = '',
  city = '',
  country = '',
  googleId = '',
  emailConfirmed = false
}) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      city,
      country,
      googleId,
      emailConfirmed,
      verification: uuid.v4(),
      emailConfirmationCode: uuid.v4(),
      emailConfirmationValidUntil: moment().add(10, 'years').toDate(),
      emailConfirmationRequestedAt: moment()
    })
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }

      item = JSON.parse(JSON.stringify(item))

      delete item.password
      delete item.blockExpires
      delete item.loginAttempts

      resolve(item)
    })
  })
}

module.exports = { createItemInDb }
