const { validateForgotPassword } = require('./validateForgotPassword')
const { validateLogin } = require('./validateLogin')
const { validateRegister } = require('./validateRegister')
const { validateResetPassword } = require('./validateResetPassword')
const { validateVerify } = require('./validateVerify')
const { updateInfo } = require('./updateInfo')

module.exports = {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateVerify,
  updateInfo
}
