const { matchedData } = require('express-validator')
const User = require('../../models/user')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const checkVerification = await User.findOne({ email: data.email })
    // if (checkVerification) {
    //   if (
    //     checkVerification.verified == false &&
    //     checkVerification.role == 'girl'
    //   ) {
    //     return res.status(400).json({
    //       error: 'verify',
    //       message: 'Пожалуйста дождитесь пока администратор подтвердит ваш аккаунт. Загрузите документ подтверждающий вашу личность.'
    //     })
    //     // Please wait until admin verify your account. or Upload the national Id to approve your profile
    //   }
    // }
    // if (checkVerification && checkVerification.verified == false && checkVerification.role == 'girl' && checkVerification.nationalId) {
    //   return res.status(400).json({
    //     error: 'verify_wait',
    //     message: 'Пожалуйста дождитесь пока администратор подтвердит ваш аккаунт.'
    //   })
    // }

    const user = await findUser(data.email)
    await userIsBlocked(user)
    await checkLoginAttemptsAndBlockExpires(user)
    const isPasswordMatch = await checkPassword(data.password, user)
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      const userToken = await saveUserAccessAndReturnToken(req, user)

      if (
        checkVerification &&
        checkVerification.verified == false &&
        checkVerification.role == 'girl'
      ) {
        return res.status(200).json({
          message: 'signInForm.notifications.verifyNoneMessage',
          verify: 'none',
          ...userToken
        })
      } else if (
        checkVerification &&
        checkVerification.verified == false &&
        checkVerification.role == 'girl' &&
        checkVerification.nationalId
      ) {
        return res.status(200).json({
          message: 'signInForm.notifications.verifyWaitMessage',
          verify: 'wait',
          ...userToken
        })
      }

      res.status(200).json(userToken)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
