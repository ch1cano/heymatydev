const User = require('../../models/user')
const { matchedData } = require('express-validator')
const { isIDGood, handleError } = require('../../middleware/utils')
const { updateItem } = require('../../middleware/db')
const { emailExistsExcludingMyself } = require('../../middleware/emailer')
const {
  profileUrlExistsExcludingMyself
} = require('../../middleware/profile_url')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUser = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    let error = false
    if (!(await emailExistsExcludingMyself(id, req.email))) {
      error = true
    }
    if (await profileUrlExistsExcludingMyself) {
      error = true
    }
    if (!error) {
      res.status(200).json(await updateItem(id, User, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateUser }
