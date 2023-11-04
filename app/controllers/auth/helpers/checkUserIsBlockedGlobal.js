const User = require('../../../models/user')
const { getUserIdFromToken } = require('./getUserIdFromToken.js')

/**
 * Check if user is blocked global middleware
 * @param {string} token - Encrypted and encoded token
 */
const checkUserIsBlockedGlobal = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const userId = await getUserIdFromToken(
      req.headers.authorization.replace('Bearer ', '').trim()
    )
    const user = await User.findById(userId)
    if (user.blockExpires > new Date()) {
      return res.status(403).json({
        errors: {
          msg: 'USER_BLOCKED'
        }
      })
    }
  }
  next()
}

module.exports = { checkUserIsBlockedGlobal }
