const User = require('../../models/user')
const { matchedData } = require('express-validator')
const { isIDGood, handleError } = require('../../middleware/utils')
const { getItem } = require('../../middleware/db')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUserForEdit = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    const user = await getItem(id, User)
    res.status(200).json({ user })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUserForEdit }
