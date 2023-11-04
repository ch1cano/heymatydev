const { putSubscriptionToDB } = require('./helpers/putSubscriptionToDB')
const { isIDGood, handleError } = require('../../middleware/utils')
const moment = require('moment')

/**
 * Create subscription object
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createSubscription = async (req, res) => {
  try {
    const { days, tariffId } = req.body
    const { _id: subscriberId } = req.user
    await isIDGood(subscriberId)
    const subscriptionData = {
      days,
      activeUpTo: moment().add(days, 'days').toDate(),
      tariff: tariffId,
      subscriber: subscriberId
    }
    const putResult = await putSubscriptionToDB(subscriptionData)
    if (!putResult.ok) {
      return res.status(400).json(putResult)
    }
    res.status(200).json(putResult.data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createSubscription }
