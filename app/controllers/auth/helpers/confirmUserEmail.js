const { buildErrObject } = require('../../../middleware/utils')

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const confirmUserEmail = (user = {}) => {
  return new Promise((resolve, reject) => {
    user.emailConfirmed = true
    user.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        emailConfirmed: item.emailConfirmed
      })
    })
  })
}

module.exports = { confirmUserEmail }
