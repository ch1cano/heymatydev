const express = require('express')
const router = express.Router()
require('../../config/passport')
const trimRequest = require('trim-request')
const passport = require('passport')
const { getMySubscriptions } = require('../controllers/sub/getMySubscriptions')
const { getMySubscribers } = require('../controllers/sub/getMySubscribers')
const {
  getAllMySubscriptions
} = require('../controllers/sub/getAllMySubscriptions')
const {
  getAllMySubscribers
} = require('../controllers/sub/getAllMySubscribers')
const { updateSubscription } = require('../controllers/sub/updateSubscription')
const { createSubscription } = require('../controllers/sub/createSubscription')
const { roleAuthorization } = require('../controllers/auth')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
/*
 * Subscription routes
 */

/*
 * Create subscription
 */
//router.post(
//  '/',
//  requireAuth,
//  roleAuthorization(['user', 'admin']),
//  trimRequest.all,
//  createSubscription
//)
//
///*
// * Update subscription
// */
//router.patch(
//  // '/:id',
//  '/',
//  requireAuth,
//  roleAuthorization(['user', 'admin']),
//  trimRequest.all,
//  updateSubscription
//)
//
///*
// * Get list of active subscribers
// */
//router.get(
//  '/my_subscribers',
//  requireAuth,
//  roleAuthorization(['girl', 'admin']),
//  trimRequest.all,
//  getMySubscribers
//)
//
///*
// * Get list of active subscriptions
// */
//router.get(
//  '/my_subscriptions',
//  requireAuth,
//  roleAuthorization(['user', 'admin']),
//  trimRequest.all,
//  getMySubscriptions
//)
//
///*
// * Get full list of subscribers
// */
//router.get(
//  '/all_my_subscribers',
//  requireAuth,
//  roleAuthorization(['girl', 'admin']),
//  trimRequest.all,
//  getAllMySubscribers
//)
//
///*
// * Get full list of subscriptions
// */
//router.get(
//  '/all_my_subscriptions',
//  requireAuth,
//  roleAuthorization(['user', 'admin']),
//  trimRequest.all,
//  getAllMySubscriptions
//)

module.exports = router
