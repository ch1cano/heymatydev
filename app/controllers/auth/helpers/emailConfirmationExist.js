const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const emailConfirmationExist = (id = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        emailConfirmationCode: id,
        emailConfirmed: false
      },
      async (err, user) => {
        try {
          await itemNotFound(err, user, 'NOT_FOUND_OR_ALREADY_CONFIRMED')
          resolve(user)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { emailConfirmationExist }
