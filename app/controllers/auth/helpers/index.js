const { blockIsExpired } = require('./blockIsExpired')
const { blockUser } = require('./blockUser')
const {
  checkLoginAttemptsAndBlockExpires
} = require('./checkLoginAttemptsAndBlockExpires')
const { checkPermissions } = require('./checkPermissions')
const { findForgotPassword } = require('./findForgotPassword')
const { findUser } = require('./findUser')
const { findUserById } = require('./findUserById')
const { findUserToResetPassword } = require('./findUserToResetPassword')
const { forgotPasswordResponse } = require('./forgotPasswordResponse')
const { generateToken } = require('./generateToken')
const { getUserIdFromToken } = require('./getUserIdFromToken')
const { markResetPasswordAsUsed } = require('./markResetPasswordAsUsed')
const { passwordsDoNotMatch } = require('./passwordsDoNotMatch')
const { registerUser } = require('./registerUser')
const { returnRegisterToken } = require('./returnRegisterToken')
const { saveForgotPassword } = require('./saveForgotPassword')
const { saveLoginAttemptsToDB } = require('./saveLoginAttemptsToDB')
const {
  saveUserAccessAndReturnToken
} = require('./saveUserAccessAndReturnToken')
const {
  saveUserAccessAndReturnTokenAdmin
} = require('./saveUserAndReturnTokenAdmin')
const { setUserInfo } = require('./setUserInfo')
const { updatePassword } = require('./updatePassword')
const { userIsBlocked } = require('./userIsBlocked')
const { verificationExists } = require('./verificationExists')
const { emailConfirmationExist } = require('./emailConfirmationExist')
const { verifyUser } = require('./verifyUser')
const { confirmUserEmail } = require('./confirmUserEmail')
const { resetEmailConfirmation } = require('./resetEmailConfirmation')

module.exports = {
  blockIsExpired,
  blockUser,
  checkLoginAttemptsAndBlockExpires,
  checkPermissions,
  findForgotPassword,
  findUser,
  findUserById,
  findUserToResetPassword,
  forgotPasswordResponse,
  generateToken,
  getUserIdFromToken,
  markResetPasswordAsUsed,
  passwordsDoNotMatch,
  registerUser,
  returnRegisterToken,
  saveForgotPassword,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken,
  setUserInfo,
  updatePassword,
  userIsBlocked,
  verificationExists,
  emailConfirmationExist,
  verifyUser,
  confirmUserEmail,
  resetEmailConfirmation,
  saveUserAccessAndReturnTokenAdmin
}
