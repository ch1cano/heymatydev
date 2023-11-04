const { putSubscriptionToDB } = require('./helpers/putSubscriptionToDB')
const { checkSubscription } = require('./helpers/checkSubscription')
const {
  checkIfSubscriptionEnabled
} = require('./helpers/checkIfSubscriptionEnabled')
const { isIDGood, handleError } = require('../../middleware/utils')
const moment = require('moment')

/**
 * Create subscription object
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createSubscription = async (req, res) => {
  try {
    const { days, modelId, amount } = req.body
    const { _id: subscriberId } = req.user
    await isIDGood(subscriberId)
    await checkIfSubscriptionEnabled(modelId)
    const existedSubscription = await checkSubscription(subscriberId, modelId)
    if (!existedSubscription.data) {
      const subscriptionData = {
        starts: moment().toDate(),
        ends: moment().add(days, 'days').toDate(),
        subscriber: subscriberId,
        model: modelId,
        amount,
        days
      }
      const putResult = await putSubscriptionToDB(subscriptionData)
      if (!putResult.ok) {
        return res.status(400).json(putResult)
      }
      return res.status(200).json(putResult.data)
    }
    throw new Error('The subscription is already existed, try to prolong it')
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createSubscription }
