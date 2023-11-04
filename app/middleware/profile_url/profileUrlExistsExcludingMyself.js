const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific profileUrl exists
 * @param {string} profileUrl - profile url
 */
const profileUrlExistsExcludingMyself = (id, profileUrl) => {
  return new Promise((resolve, reject) => {
    if (!profileUrl) {
      reject(buildErrObject(422, 'PROFILE_URL_IS_EMPTY'))
    }
    if (!id) {
      reject(buildErrObject(422, 'PROFILE_ID_IS_EMPTY'))
    }

    const filter = {
      _id: {
        $ne: id
      }
    }
    if (Number.isInteger(profileUrl)) {
      filter.profileNum = profileUrl
    } else {
      filter.profileUrl = profileUrl
    }

    User.findOne(filter, (err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }

      item ? resolve(true) : resolve(false)
    })
  })
}

module.exports = { profileUrlExistsExcludingMyself }
