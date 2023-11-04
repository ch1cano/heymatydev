const { buildErrObject } = require('../../../middleware/utils/buildErrObject')
const User = require('../../../models/user')

/**
 * Checks if given user ID has subscriptionEnabled set to true
 * @param {string} id - id to check
 */
const checkIfSubscriptionEnabled = async (id = '') => {
  const existedUser = await User.findById(id)
  return new Promise((resolve, reject) => {
    return existedUser && existedUser.subscriptionEnabled
      ? resolve(id)
      : reject(buildErrObject(400, 'SUBSCRIPTION_IS_NOT_ENABLED'))
  })
}

module.exports = { checkIfSubscriptionEnabled }
