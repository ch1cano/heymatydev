const roles = require('../../constants/clientRoles')

const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const Notification = require('../../models/notifications')
const VerifiedModel = require('../../../emails/verifiedModel')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const { role } = req.params
    if (!role || !roles.includes(role)) {
      throw new Error('Role not match')
    }
    req = matchedData(req)
    const doesEmailExists = await emailExists(req.email)
    if (!doesEmailExists) {
      const item = await registerUser(req, role)
      const userInfo = await setUserInfo(item)
      const response = await returnRegisterToken(item, userInfo)

      // if (response.user.role === 'girl') {
      //   const notification = new Notification({
      //     user: response.user._id,
      //     message: 'Загрузите фото вашего паспорта для верификации вашего аккаунта'
      //   })
      //   await notification.save()

      //   await VerifiedModel(response.user)
      // } else {
      sendRegistrationEmailMessage(locale, item)
      // }

      res.status(201).json(response)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
