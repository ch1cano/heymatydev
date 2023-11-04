const { buildErrObject } = require('../../../middleware/utils')
const moment = require('moment')
const uuid = require('uuid')

const secondsToHold = 30

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const resetEmailConfirmation = (user = {}) => {
  return new Promise((resolve, reject) => {
    const now = moment()
    const allowedToRequestAt = moment(user.emailConfirmationRequestedAt).add(
      secondsToHold,
      'seconds'
    )
    if (user.emailConfirmed) {
      return reject(buildErrObject(422, 'ERR_ALREADY_CONFIRMED'))
    }
    if (user.emailConfirmationRequestedAt && now.isBefore(allowedToRequestAt)) {
      return reject(buildErrObject(422, 'ERR_PLEASE_TRY_LATER'))
    }

    user.emailConfirmationCode = uuid.v4()
    user.emailConfirmationValidUntil = moment().add(10, 'years').toDate()
    user.emailConfirmationRequestedAt = moment()

    user.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

module.exports = { resetEmailConfirmation }
