const { isIDGood, handleError } = require('../../middleware/utils')
const { getSubscribersById } = require('./helpers/getSubscribersById')

/**
 * Get subscribers
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMySubscribers = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { limit, page } = req.query
    await isIDGood(userId)
    const paginatedResult = await getSubscribersById(userId, { limit, page })
    if (!paginatedResult.ok) {
      return res.status(400).json(paginatedResult)
    }
    res.status(200).json(paginatedResult.data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getMySubscribers }
