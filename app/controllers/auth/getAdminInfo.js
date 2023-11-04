const {
  getUserIdFromToken,
  findUserById,
  saveUserAccessAndReturnToken
} = require('./helpers')
const { isIDGood, handleError } = require('../../middleware/utils')
const { setUserInfo } = require('./helpers/setUserInfo')

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAdminInfo = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let userId = await getUserIdFromToken(tokenEncrypted)
    userId = await isIDGood(userId)
    const user = await findUserById(userId)
    const userInfo = await setUserInfo(user)
    const resp = {
      user: userInfo,
      permissions: [
        { name: 'languages' },
        { name: 'languages.create' },
        { name: 'languages.edit' },
        { name: 'languages.delete' },
        { name: 'service' },
        { name: 'service.create' },
        { name: 'service.edit' },
        { name: 'service.delete' },
        { name: 'models.delete' },
        { name: 'models.edit' },
        { name: 'models.create' },
        { name: 'models' }
      ]
    }
    res.status(200).json(resp)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAdminInfo }
