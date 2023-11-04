const express = require('express')
const router = express.Router()
require('../../config/passport')
const trimRequest = require('trim-request')
const passport = require('passport')
const {
  getMySubscriptions
} = require('../controllers/subscription/getMySubscriptions')
const {
  getMySubscribers
} = require('../controllers/subscription/getMySubscribers')
const {
  updateSubscription
} = require('../controllers/subscription/updateSubscription')
const {
  createSubscription
} = require('../controllers/subscription/createSubscription')
const { roleAuthorization } = require('../controllers/auth')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

const Subscription = require('../controllers/subscription/subscription')

const {
  createSubScription
} = require('../controllers/subscription/validators/subscription')

/*
 * Subscription routes
 */

/*
 * Create subscription
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  createSubscription
)

/*
 * Update subscription
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  updateSubscription
)

/*
 * Get list of subscribers
 */
router.get(
  '/my_subscribers',
  requireAuth,
  roleAuthorization(['girl', 'admin']),
  trimRequest.all,
  getMySubscribers
)

/*
 * Get list of subscriptions
 */
router.get(
  '/my_subscriptions',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getMySubscriptions
)

/*
 * Create new subscription
 */
router.post(
  '/create',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  createSubScription,
  Subscription.createSubscription
)

module.exports = router
