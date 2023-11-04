const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { upload } = require('../middleware/multer/multer')

const {
  register,
  updateModelProfile,
  updateModelAvatar,
  updateModelCover,
  verify,
  confirmEmail,
  requestConfirmation,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  getAdminInfo,
  login,
  roleAuthorization,
  // googleCallback,
  googleLogin
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin,
  updateInfo
} = require('../controllers/auth/validators')

const Auth = require('../controllers/auth/auth')

/*
 * Auth routes
 */

// router.get('/auth/google/:role(girl|user)', googleLogin)
router.post('/auth/google', trimRequest.all, googleLogin)
// router.get(
//   '/auth/google_callback/:role(girl|user)',
//   trimRequest.all,
//   googleCallback
// )

/*
 * Register route
 */
router.post(
  '/register/:role(girl|user)',
  trimRequest.all,
  validateRegister,
  register
)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Confirm email route
 */
router.post('/confirmEmail', trimRequest.all, validateVerify, confirmEmail)

/*
 * Request email confirmation route
 */
router.post(
  '/requestConfirmEmail',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  requestConfirmation
)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

/*
 * Login route
 */
router.post('/admin/login', trimRequest.all, validateLogin, Auth.Login)

/*
 * Get admin info
 */
router.get(
  '/admin/info',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  getAdminInfo
)

/*
 * update profile
 */

router.post(
  '/update-profile-model',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  updateInfo,
  updateModelProfile
)

// update model avatar

router.put(
  '/update-avatar-model',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  upload.single('profile'),
  updateModelAvatar
)

// update model cover

router.put(
  '/update-cover-model',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  upload.single('cover'),
  updateModelCover
)

module.exports = router
