const Subscription = require('../../../models/subscription')

const getSubscriptionsById = async (id, { limit, page }) => {
  try {
    const subscriptions = await Subscription.paginate(
      {
        subscriber: id
      },
      {
        limit,
        page,
        populate: 'model',
        lean: true
      }
    )
    return {
      ok: true,
      data: subscriptions
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
