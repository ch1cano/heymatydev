const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const Services = require('../controllers/services/services')

const {
  serviceCreate,
  serviceUpdate
} = require('../controllers/services/validators/services')

/*
 * Services routes
 */

/*
 * Create the Service
 */
router.post(
  '/create',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  serviceCreate,
  Services.CreateService
)

/*
 * Get delete the service with the id
 */
router.delete(
  '/delete/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  Services.deleteService
)

/*
 * Get services route
 */
router.get(
  '/',
  // requireAuth,
  // roleAuthorization(['user', 'girl', 'admin']),
  trimRequest.all,
  Services.getServices
)

/*
 * edit the service
 */
router.get(
  '/edit/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  Services.getService
)

/*
 * Update the Service
 */
router.put(
  '/update/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  serviceUpdate,
  Services.updateService
)

module.exports = router
