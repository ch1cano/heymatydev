const { handleError, isIDGood } = require('../../middleware/utils')
const { updateSubscriptionInDB } = require('./helpers/updateSubscriptionInDB')
const { checkSubscription } = require('./helpers/checkSubscription')
const {
  checkIfSubscriptionEnabled
} = require('./helpers/checkIfSubscriptionEnabled')
const moment = require('moment')

/**
 * Update subscription object
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateSubscription = async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { days, modelId, amount } = req.body
    const { _id: subscriberId } = req.user
    await isIDGood(subscriberId)
    await checkIfSubscriptionEnabled(modelId)
    const existedSubscription = await checkSubscription(subscriberId, modelId)
    if (existedSubscription.data) {
      const subscriptionData = {
        id: existedSubscription.data._id,
        starts: moment(existedSubscription.data.ends).toDate(),
        ends: moment(existedSubscription.data.ends).add(days, 'days').toDate(),
        amount,
        subscriber: subscriberId,
        days
      }
      const updateResult = await updateSubscriptionInDB(subscriptionData)
      if (!updateResult.ok) {
        return res.status(400).json(updateResult)
      }
      return res.status(200).json(updateResult)
    }
    throw new Error('The subscription is not exist, try to create new one')
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateSubscription }
