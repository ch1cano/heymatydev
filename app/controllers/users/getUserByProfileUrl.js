const User = require('../../models/user')
const Post = require('../../models/post')
const { handleError } = require('../../middleware/utils')
const { getProfileByUrl } = require('../../middleware/db')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUserByProfileUrl = async (req, res) => {
  try {
    // const url = req.url.replace('/profile/', '')
    const { id } = req.params
    console.log(id)
    res.status(200).json(await getProfileByUrl(id, User, Post))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUserByProfileUrl }
