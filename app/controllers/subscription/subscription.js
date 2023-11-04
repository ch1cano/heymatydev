const Subscription = require('../../models/subscription')
const Tariff = require('../../models/tariff')
const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')

exports.createSubscription = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    const { tariffId, days } = req.body

    const userId = req.user._id

    const tariff = await Tariff.findById(tariffId)
    if (!tariff) {
      return res.status(404).json({ message: 'Tariff not found' })
    }

    const checkSubscriber = await Subscription.findOne({
      model: tariff.user,
      subscriber: userId
    })

    if (!checkSubscriber) {
      const endDate = new Date() // Now
      endDate.setDate(endDate.getDate() + days) // Set now + n number of days as the new endDate

      const newSubscriber = new Subscription({
        tariff: tariffId,
        subscriber: userId,
        model: tariff.user,
        days,
        sum: days,
        activeUpTo: endDate
      })

      await newSubscriber.save()

      const sub = await Subscription.findById(newSubscriber._id).populate(
        'subscriber tariff model'
      )

      return res
        .status(200)
        .json({ subscribe: sub, message: 'You subscribe SuccessFully!' })
    } else {
      const endDate = checkSubscriber.activeUpTo // Now
      endDate.setDate(endDate.getDate() + days) // Set now + n number of days as the new endDate

      const updateSubscription = await Subscription.findByIdAndUpdate(
        checkSubscriber._id,
        {
          activeUpTo: endDate,
          days,
          sum: days + checkSubscriber.sum
        },
        { new: true }
      ).populate('subscriber tariff model')

      return res.status(200).json({
        subscribe: updateSubscription,
        message: 'Your limit has been extend'
      })
    }
  } catch (e) {
    return handleError(res, e)
  }
}
