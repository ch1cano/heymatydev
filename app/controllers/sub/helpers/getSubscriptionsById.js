const Subscription = require('../../../models/sub')

const getSubscriptionsById = async (id, { limit = 10, page = 1 }) => {
  try {
    const now = new Date()
    // const subscriptions = await Subscription.paginate(
    //   {
    //     subscriber: id
    //   },
    //   {
    //     limit,
    //     page,
    //     populate: ['model', 'payments'],
    //     lean: true
    //   }
    // )
    const projection =
      '_id age blockExpires bundles country cover city description favouritesCount languages name pricePerDay pricePerMessage profile profileGallery profileNum profileUrl role services subscriptionEnabled verified personalDayOfBirth personalMonthOfBirth personalYearOfBirth personalCountry personalCity'
    const subscriptions = await Subscription.find({
      subscriber: id,
      ends: { $gte: now }
    })
      .populate([
        // 'model',
        { path: 'model', select: projection },
        'payments'
      ])
      .lean(true)
    return {
      ok: true,
      data: { docs: subscriptions } //if we will use pagination change this to data: subscriptions
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { getSubscriptionsById }
