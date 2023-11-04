const Subscription = require('../../../models/sub')

const getAllSubscribersById = async (id, { limit, page }) => {
  try {
    // const subscribers = await Subscription.paginate(
    //   {
    //     model: id
    //   },
    //   { limit, page, populate: ['subscriber', 'payments'], lean: true }
    // )
    const subscribers = await Subscription.find({
      model: id
    })
      .populate(['subscriber', 'payments'])
      .lean(true)
    return {
      ok: true,
      data: { docs: subscribers } //if we will use pagination change this to data: subscribers
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { getAllSubscribersById }
