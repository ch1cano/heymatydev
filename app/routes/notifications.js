const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const NotificationController = require('../controllers/notifications/notifications')

/*
 * Users routes Notifications
 */

/*
 * Get All Notifications
 */
router.get(
  '/all',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  NotificationController.allNotifications
)

/*
 * Get Unreadable Notifications
 */
router.get(
  '/unreadable',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  NotificationController.unreadableNotification
)
/*
 * Get readable Notifications
 */
router.get(
  '/readable',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  NotificationController.readableNotification
)

/*
 * State Changed to read Notification
 */
router.get(
  '/read/:id',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  NotificationController.readNotification
)

module.exports = router
