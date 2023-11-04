const Subscription = require('../../../models/sub')
const Payment = require('../../../models/payment')
const User = require('../../../models/user')
const moment = require('moment')

const updateSubscriptionInDB = async (data) => {
  // eslint-disable-next-line no-unused-vars
  const holdDays = 1 // Additional days to hold payment by default
  const { id, starts, ends, subscriber, amount, days } = data
  try {
    const subscription = await Subscription.findById(id)
    // const session = await User.startSession()
    // await session.withTransaction(async () => {
    const existedSubscriber = await User.findById(subscriber)
    if (
      !existedSubscriber ||
      !['user', 'admin'].includes(existedSubscriber.role)
    ) {
      throw new Error('Incorrect subscriber data')
    }

    if (existedSubscriber.balance < amount) {
      throw new Error('Balance is not enough to buy the subscription')
    }
    existedSubscriber.balance -= amount
    await existedSubscriber.save()
    subscription.set({ ends })
    await subscription.save()
    const newPayment = new Payment({
      registerDate: new Date(),
      periodStart: starts,
      periodEnd: ends,
      amount,
      finished: false,
      sub: subscription._id,
      plannedPayoutDate: moment(ends).add(holdDays, 'days').toDate(),
      from: subscriber,
      to: subscription.model
    })
    await newPayment.save(async (err) => {
      subscription.payments.push(newPayment)
      await subscription.save()
    })
    // })
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

module.exports = { updateSubscriptionInDB }
