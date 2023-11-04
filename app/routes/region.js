const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')
const Region = require('../controllers/region/region')
/*
 * Get all countries
 */
router.get(
  '/countries',
  // requireAuth,
  // roleAuthorization(['user', 'girl', 'admin']),
  trimRequest.all,
  Region.allCountries
)

/*
 * Get states by country
 */
router.get(
  '/states/:countryISO',
  requireAuth,
  roleAuthorization(['user', 'girl', 'admin']),
  trimRequest.all,
  Region.countryStates
)

/*
 * Get cities by country & states
 */
router.get('/cities', trimRequest.all, Region.cities)

module.exports = router
