const { matchedData } = require('express-validator')
const {
  findUserById,
  resetEmailConfirmation,
  emailConfirmationExist,
  confirmUserEmail
} = require('./helpers')

const { sendRegistrationEmailMessage } = require('../../middleware/emailer')

const { handleError } = require('../../middleware/utils')

/**
 * requestConfirmation function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const requestConfirmation = async (req, res) => {
  try {
    const { _id } = req.user
    const user = await findUserById(_id)
    const updatedUser = await resetEmailConfirmation(user)
    console.log(updatedUser)
    sendRegistrationEmailMessage('', updatedUser)
    res.status(200).json(updatedUser)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { requestConfirmation }
