const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const Language = require('../controllers/language/language')

const {
  languageCreate,
  languageUpdate
} = require('../controllers/language/validators/language')

/*
 * Language routes
 */

/*
 * Create the Language
 */
router.post(
  '/create',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  languageCreate,
  Language.CreateLanguage
)

/*
 * Get delete the Language with the id
 */
router.delete(
  '/delete/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  Language.deleteLanguage
)

/*
 * Get Languages route
 */
router.get(
  '/',
  // requireAuth,
  // roleAuthorization(['user', 'girl', 'admin']),
  trimRequest.all,
  Language.getLanguages
)

/*
 * Update the Language
 */
router.put(
  '/update/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  languageUpdate,
  Language.updateLanguage
)

/*
 * edit the Language
 */
router.get(
  '/edit/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  Language.getLanguage
)

module.exports = router
