const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { upload } = require('../middleware/multer/multer')

const Models = require('../controllers/model/model')

const { roleAuthorization } = require('../controllers/auth')

const {
  getUsers,
  createUser,
  getUser,
  getUserByProfileUrl,
  updateUser,
  deleteUser,
  getAllReceipts,
  updateUser1,
  updateUserAvatar,
  updateUserCover,
  updateOutBTCAddress,
  getUserForEdit,
  getUsersAndModerators,
  promoteUser,
  downgradeModerator,
  updateUserByAdmin,
  updateUserAvatarByAdmin
} = require('../controllers/users')

const {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser,
  validateUpdateUser1
} = require('../controllers/users/validators')

/*
 * Users routes
 */

/*
 * Get All Receipts
 */
router.get(
  '/receipts',
  requireAuth,
  roleAuthorization(['admin', 'user', 'girl']),
  trimRequest.all,
  getAllReceipts
)

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  getUsers
)

/*
 * Get users and moderators route
 */
router.get(
  '/user-and-moderators',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getUsersAndModerators
)

/*
 * Promote user to moderator status route
 */
router.get(
  '/user-and-moderators/promote/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  promoteUser
)

/*
 * Downgrade moderator to user status route
 */
router.get(
  '/user-and-moderators/downgrade/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  downgradeModerator
)

/*
 * Update the user
 */
router.patch(
  '/user-and-moderators/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  updateUserByAdmin
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateUser,
  createUser
)

/*
 * Get item route
 */
router.get(
  '/:id',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  validateGetUser,
  getUser
)

/*
 * Get user by profileUrl
 */
router.get(
  '/profile/:id',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  validateGetUser,
  getUserByProfileUrl
)

/*
 * edit the user
 */
router.get(
  '/edit/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetUser,
  getUserForEdit
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateUser,
  updateUser
)

// update the user

router.put(
  '/update',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validateUpdateUser1,
  updateUser1
)

// update the outgoing BTC address

router.put(
  '/update-out-btc-address',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  updateOutBTCAddress
)

// upload user avatar

router.put(
  '/update-avatar',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  upload.single('profile'),
  updateUserAvatar
)

// upload user cover

router.put(
  '/update-cover',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  upload.single('cover'),
  updateUserCover
)

// upload user avatar by admins

router.put(
  '/update-avatar/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  upload.single('profile'),
  updateUserAvatarByAdmin
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteUser,
  deleteUser
)

const {
  age,
  pricePerDay,
  createModel,
  country,
  city,
  state
} = require('../controllers/model/validators/model')

/*
 * Models routes
 */

/*
 * Create new girl route
 */
router.post(
  '/create-girl-account',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  upload.single('profile'),
  createModel,
  Models.createGirl
)

/*
 * SignUp the model
 */
router.post(
  '/model/register',
  trimRequest.all,
  upload.single('profile'),
  createModel,
  Models.createModel
)

/*
 * Getting all model
 */
router.get(
  '/model/all',
  // requireAuth,
  // roleAuthorization(['admin', 'user']),
  trimRequest.all,
  Models.getAllModels
)

/*
 * Getting all model for admin
 */
router.get(
  '/admin/model/all',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.getAllModelsAdmin
)

/*
 * Update the model
 */
router.patch(
  '/model/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.updateModel
)

/*
 * Verified the model
 */
router.get(
  '/model/verify/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.verifiedModel
)

/*
 * Unverified the model
 */
router.get(
  '/model/unverify/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.unverifiedModel
)

/*
 * Block the model
 */
router.get(
  '/model/block/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.blockModel
)

/*
 * Unblock the model
 */
router.get(
  '/model/unblock/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  trimRequest.all,
  Models.unblockModel
)

/*
 * Get all models price per day
 */
router.post(
  '/model/price-per-day',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  pricePerDay,
  Models.GetByPrice
)

/*
 * Get all models by age
 */
router.post(
  '/model/age',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  age,
  Models.modelByAge
)

/*
 * Get all ages
 */
router.get('/model/ages', trimRequest.all, Models.getAges)
/*
 * Get model by service
 */
router.get(
  '/model/service/:id',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  Models.getAllModelWithService
)

/*
 * Get model by language
 */
router.get(
  '/model/language/:id',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  Models.getAllModelWithLanguage
)

/*
 * Upload the National id card
 */
router.put(
  '/model/national',
  upload.single('id_card'),
  trimRequest.all,
  requireAuth,
  roleAuthorization(['girl']),
  Models.uploadIdCard
)

/*
 * Get all models by country
 */
router.get(
  '/model/country',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  country,
  Models.getAllModelWithCountry
)

/*
 * Get all models by city
 */
router.get(
  '/model/city',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  city,
  Models.getAllModelWithCity
)

module.exports = router
