const Subscription = require('../../../models/sub')

const getAllSubscriptionsById = async (id, { limit = 10, page = 1 }) => {
  try {
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
    const subscriptions = await Subscription.find({
      subscriber: id
    })
      .populate(['model', 'payments'])
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

module.exports = { getAllSubscriptionsById }
