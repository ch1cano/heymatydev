/* eslint-disable max-statements */
require('dotenv-safe').config()
const initMongo = require('../config/mongo')
// const Subscription = require('../app/models/sub')
// const Bundle = require('../app/models/bundle')
// const Message = require('../app/models/message')
const Payment = require('../app/models/payment')
const User = require('../app/models/user')

console.log('Job started')
// Init MongoDB
initMongo()
const now = new Date()

const job = async () => {
  try {
    const unfinishedPayments = await Payment.find({
      finished: false, // not finished
      plannedPayoutDate: { $lt: now }, // the planned date is less then now
      holded: { $not: { $eq: true } } // not holded
    })
    console.log(`Got ${unfinishedPayments.length} unfinished payments`)
    if (unfinishedPayments.length) {
      for (let i = 0; i < unfinishedPayments.length; i++) {
        // const sub = await Subscription.findById(unfinishedPayments[i].sub)
        // const bundle = await Bundle.findById(unfinishedPayments[i].bundle)
        // const message = await Message.findById(unfinishedPayments[i].message)

        // if (!sub && !bundle && !message) {
        //   break
        // }
        const finishedPayment = {
          finished: true,
          actualPayoutDate: now
        }
        if (!unfinishedPayments[i].periodEnd) {
          finishedPayment.periodEnd = now
        }
        if (!unfinishedPayments[i].periodStart) {
          finishedPayment.periodStart = now
        }
        await unfinishedPayments[i].set(finishedPayment)
        // let modelId
        // if (sub) {
        //   modelId = sub.model
        // }
        // if (bundle) {
        //   modelId = bundle.user
        // }
        // if (message) {
        //   modelId = message.to
        // }
        const modelId = unfinishedPayments[i].to
        const model = await User.findById(modelId)
        if (!model) {
          console.log(`Can't find a model by id ${modelId}, aborting`)
          continue
        }
        await model.set({
          balance: Math.floor(
            parseInt(model.balance) + parseInt(unfinishedPayments[i].amount)
          )
        })

        await unfinishedPayments[i].save()
        await model.save()
        console.log(
          `The payment amount of ${unfinishedPayments[i].amount} added to model ${model.name} balance`
        )
      }
    }
  } catch (error) {
    console.error(error)
  }
  process.exit(0)
}

job()
