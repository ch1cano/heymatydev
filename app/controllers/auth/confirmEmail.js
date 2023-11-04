const { matchedData } = require('express-validator')
const { emailConfirmationExist, confirmUserEmail } = require('./helpers')

const { handleError } = require('../../middleware/utils')

/**
 * confirmEmail function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const confirmEmail = async (req, res) => {
  try {
    req = matchedData(req)
    const user = await emailConfirmationExist(req.id)
    res.status(200).json(await confirmUserEmail(user))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { confirmEmail }
