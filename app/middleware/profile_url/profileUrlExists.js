const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific profileUrl exists
 * @param {string} profileUrl - profile url
 */
const profileUrlExists = (profileUrl) => {
  return new Promise((resolve, reject) => {
    if (!profileUrl) {
      reject(buildErrObject(422, 'PROFILE_URL_IS_EMPTY'))
    }

    const filter = Number.isInteger(profileUrl)
      ? {
          profileNum: profileUrl
        }
      : {
          profileUrl
        }

    User.findOne(filter, (err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }

      if (item) {
        resolve(true)
      }
      reject(buildErrObject(422, 'PROFILE_IS_NOT_FOUND'))
    })
  })
}

module.exports = { profileUrlExists }
