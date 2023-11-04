const { googleLogin } = require('./googleLogin')
const { googleCallback } = require('./googleCallback')
const { forgotPassword } = require('./forgotPassword')
const { getAdminInfo } = require('./getAdminInfo')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { register } = require('./register')
const { resetPassword } = require('./resetPassword')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')
const { confirmEmail } = require('./confirmEmail')
const { requestConfirmation } = require('./requestConfirmation')
const { updateModelProfile } = require('./updateModelProfile')
const { updateModelAvatar } = require('./updateModelAvatar')
const { updateModelCover } = require('./updateModelCover')

module.exports = {
  forgotPassword,
  getRefreshToken,
  login,
  register,
  resetPassword,
  roleAuthorization,
  verify,
  confirmEmail,
  requestConfirmation,
  googleCallback,
  googleLogin,
  updateModelProfile,
  updateModelAvatar,
  updateModelCover,
  getAdminInfo
}
