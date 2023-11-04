const { matchedData } = require('express-validator')
const User = require('../../models/user')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnTokenAdmin
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

exports.Login = async (req, res) => {
  try {
    const data = matchedData(req)
    const checkVerification = await User.findOne({ email: data.email })
    if (checkVerification) {
      if (
        checkVerification.role != 'admin' &&
        checkVerification.role != 'moderator'
      ) {
        return res.status(400).json({
          message:
            'Only Admin or Moderator Can has access to login from this route'
        })
      }
    }
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
      res.status(200).json(await saveUserAccessAndReturnTokenAdmin(req, user))
    }
  } catch (error) {
    handleError(res, error)
  }
}
