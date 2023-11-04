const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const Favourites = require('../controllers/favourites/favourites')

const {
  createFavourite
} = require('../controllers/favourites/validators/favourites')

/*
 * Favourites routes
 */

/*
 * Get all user favourite route
 */
router.get(
  '/mine',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  Favourites.GetMineFavourites
)

/*
 * Create new favourite route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  createFavourite,
  Favourites.createFavourite
)

/*
 * Get item route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  Favourites.getFavourite
)

/*
 * Get favourites count for model
 */
router.get(
  '/count/:modelId',
  // requireAuth,
  // roleAuthorization(['user']),
  trimRequest.all,
  Favourites.GetFavouritesCount
)

/*
 * Delete favourite route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  trimRequest.all,
  Favourites.delFavourite
)

module.exports = router
