const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const Posts = require('../controllers/posts/posts')

const { upload } = require('../middleware/multer/multer')

const {
  createPost,
  validateUpdateUser
} = require('../controllers/posts/validators/posts')

/*
 * Get All Posts
 */

router.get(
  '/all-public-posts',
  requireAuth,
  roleAuthorization(['admin', 'user', 'girl']),
  trimRequest.all,
  Posts.getFeedPosts
)

/*
 * Get single post route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['girl', 'user']),
  trimRequest.all,
  Posts.getPost
)

/*
 * Get all girl post route
 */
router.get(
  '/user/:id',
  requireAuth,
  roleAuthorization(['girl', 'user']),
  trimRequest.all,
  Posts.getGirlPost
)

/*
 * Create new post route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  upload.fields([
    { name: 'videos', maxCount: 3 },
    { name: 'images', maxCount: 10 }
  ]),
  createPost,
  Posts.createPost
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin', 'girl']),
  trimRequest.all,
  upload.fields([{ name: 'videos' }, { name: 'images' }]),
  validateUpdateUser,
  Posts.updateUser
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['girl', 'admin']),
  trimRequest.all,
  Posts.deleteUser
)

/*
 * Get All Public Posts of the Specific Girl
 */
router.get(
  '/all-public-posts/girl/:id',
  // requireAuth,
  // roleAuthorization(['admin', 'user']),
  trimRequest.all,
  Posts.getAllPostsGirl
)

/*
 * Get All My Posts - access from girls only
 */
router.get(
  '/all-my-posts/girl',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  Posts.getAllMyPostsGirl
)

/*
 * Get All Private Posts of the Specific Girl
 */
router.get(
  '/all-private-posts/girl/:id',
  requireAuth,
  roleAuthorization(['admin', 'user', 'girl']),
  trimRequest.all,
  Posts.getAllPrivateGirl
)

/*
 * Get All Posts of the Specific Girl
 */
router.get(
  '/all-posts/girl/:id',
  requireAuth,
  roleAuthorization(['admin', 'user']),
  trimRequest.all,
  Posts.getAllPostsForSubscriber
)

module.exports = router
