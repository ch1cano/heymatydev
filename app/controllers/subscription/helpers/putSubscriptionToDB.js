const Subscription = require('../../../models/subscription')
const User = require('../../../models/user')
const Tariff = require('../../../models/tariff')

const putSubscriptionToDB = async (data) => {
  // eslint-disable-next-line no-unused-vars
  const { id, _id, ...subscriptionData } = data
  const subscription = new Subscription(subscriptionData)
  try {
    const session = await User.startSession()
    await session.withTransaction(async () => {
      const subscriber = await User.findById(
        subscriptionData.subscriber,
        null,
        {
          session
        }
      )
      if (!subscriber || !['user', 'admin'].includes(subscriber.role)) {
        throw new Error('Incorrect subscriber data')
      }
      const tariff = await Tariff.findById(subscriptionData.tariff, null, {
        session
      })
        .populate('user')
        .lean()
      if (!tariff || !tariff.user) {
        throw new Error('Incorrect tariff data')
      }
      if (!tariff.user || !['girl', 'admin'].includes(tariff.user.role)) {
        throw new Error('Incorrect subscriber data')
      }
      const subscriptionPrice = subscriptionData.days * parseFloat(tariff.rate)
      if (isNaN(subscriptionPrice)) {
        throw new Error('Incorrect subscription price')
      }
      if (subscriber.balance < subscriptionPrice) {
        throw new Error('Balance is not enough to buy the subscription')
      }
      subscriber.balance -= subscriptionPrice
      subscription.sum = subscriptionPrice
      subscription.model = tariff.user._id
      await subscriber.save({ session })
      await subscription.save({ session })
    })
    return {
      ok: true,
      data: subscription
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { putSubscriptionToDB }
