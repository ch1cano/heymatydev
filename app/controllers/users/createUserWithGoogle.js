const { createItemInDb } = require('./helpers')
const User = require('../../models/user')
/**
 * Create item function called by route
 * @param {Function} done
 * @param {Object} userData
 * @param {String} userData.id
 * @param {String} userData.displayName
 * @param {String} userData.email
 * @param {String} userData.role
 */
const createUserWithGoogle = async (userData) => {
  try {
    let existUser = await User.findOne({
      email: userData.email
    })
    if (!existUser) {
      existUser = await createItemInDb({
        name: userData.displayName,
        email: userData.email,
        role: userData.role,
        googleId: userData.googleId,
        emailConfirmed: true
      })
    }
    return { ok: true, item: existUser }
  } catch (error) {
    console.error(error)
    return { ok: false, message: 'Error while create user' }
  }
}

module.exports = { createUserWithGoogle }
