require('dotenv-safe').config()
const initMongo = require('../config/mongo')
const Subscription = require('../app/models/sub')
const Payment = require('../app/models/payment')
const User = require('../app/models/user')
const mongoose = require('mongoose')

console.log('Job started')
// Init MongoDB
initMongo()
const now = new Date()

const job = async () => {
  const unfinishedPayments = await Payment.find({
    finished: false,
    plannedPayoutDate: { $lt: now }
  })
  console.log(`Got ${unfinishedPayments.length} unfinished payments`)
  if (unfinishedPayments.length) {
    for (let i = 0; i < unfinishedPayments.length; i++) {
      const session = await mongoose.startSession()
      session.startTransaction()

      const sub = await Subscription.findById(
        unfinishedPayments[i].sub
      ).session(session)
      if (!sub) await session.abortTransaction()
      await unfinishedPayments[i]
        .set({ finished: true, actualPayoutDate: now })
        .session(session)
      const model = await User.findById(sub.model).session(session)
      if (!model) await session.abortTransaction()
      await model
        .set({
          balance: Math.floor(
            parseInt(model.balance) + parseInt(unfinishedPayments[i].amount)
          )
        })
        .session(session)
      await unfinishedPayments[i].save().session(session)
      await model.save().session(session)
      console.log(
        `The payment amount of ${unfinishedPayments[i].amount} added to model ${model.name} balance`
      )

      session.endSession()
    }
  }
  process.exit(0)
}

job()
