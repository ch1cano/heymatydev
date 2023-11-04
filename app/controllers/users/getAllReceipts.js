const User = require('../../models/user')
const Receipt = require('../../models/receipt')
const { handleError } = require('../../middleware/utils')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user._id }).populate(
      'model'
    )
    res.status(201).json(receipts)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAllReceipts }
