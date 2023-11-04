const { handleError } = require('../../middleware/utils')
const { updateSubscriptionInDB } = require('./helpers/updateSubscriptionInDB')

/**
 * Update subscription object
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateSubscription = async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { id, _id, ...subscriptionData } = req.body
    const { id: subscriptionId } = req.params
    const updateResult = await updateSubscriptionInDB(
      subscriptionId,
      subscriptionData
    )
    if (!updateResult.ok) {
      return res.status(400).json(updateResult)
    }
    res.status(200).json(updateResult)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateSubscription }
