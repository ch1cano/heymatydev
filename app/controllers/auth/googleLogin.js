const passport = require('passport')
const _ = require('lodash')
const { setUserInfo, returnRegisterToken, userIsBlocked } = require('./helpers')

const Notification = require('../../models/notifications')
const VerifiedModel = require('../../../emails/verifiedModel')

const { matchedData } = require('express-validator')

const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const { handleError } = require('../../middleware/utils')
// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

// const googleLogin = (req, res, next) => {
//   return passport.authenticate(`google-role-${req.params.role}`, {
//     scope: ['profile', 'email'],
//     session: false
//   })(req, res, next)}

const googleLogin = (req, res, next) => {
  let role = req.body.role || 'user'
  passport.authenticate(`google-idtoken-${role}`, {
    scope: ['profile', 'email'],
    session: false
  })(
    req,
    res,
    _.bind(async (error) => {
      if (error) {
        return handleError(res, error)
      }

      try {
        const locale = req.getLocale()

        const item = res.req.user

        const userInfo = await setUserInfo(item)
        await userIsBlocked(userInfo)
        const response = await returnRegisterToken(item, userInfo)

        // if (response.user.role === 'girl') {
        //   const notification = new Notification({
        //     user: response.user._id,
        //     message:
        //       'Загрузите фото вашего паспорта для верификации вашего аккаунта'
        //   })
        //   await notification.save()

        //   await VerifiedModel(response.user)
        // } else {
        // sendRegistrationEmailMessage(locale, item)
        // }

        return res.status(200).json(response)
      } catch (err) {
        handleError(res, err)
      }
    }, this)
  )
}

module.exports = { googleLogin }
