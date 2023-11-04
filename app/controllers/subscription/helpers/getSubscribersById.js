const Subscription = require('../../../models/subscription')

const getSubscribersById = async (id, { limit, page }) => {
  try {
    const subscribers = await Subscription.paginate(
      {
        model: id
      },
      { limit, page, populate: 'subscriber', lean: true }
    )
    return {
      ok: true,
      data: subscribers
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { getSubscribersById }
