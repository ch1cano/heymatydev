const express = require('express')
const router = express.Router()
require('../../config/passport')
const trimRequest = require('trim-request')
const passport = require('passport')
const { createTariff } = require('../controllers/tariff/createTariff')
const { roleAuthorization } = require('../controllers/auth')
const { updateTariff } = require('../controllers/tariff/updateTariff')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

/*
 * Tariff routes
 */

/*
 * Create tariff
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['girl', 'admin']),
  trimRequest.all,
  createTariff
)

/*
 * Update tariff
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['girl', 'admin']),
  trimRequest.all,
  updateTariff
)

module.exports = router
