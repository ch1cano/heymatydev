const Subscription = require('../../../models/sub')

const getSubscribersById = async (id, { limit, page }) => {
  try {
    const now = new Date()
    // const subscribers = await Subscription.paginate(
    //   {
    //     model: id
    //   },
    //   { limit, page, populate: ['subscriber', 'payments'], lean: true }
    // )
    const projection =
      '_id age blockExpires bundles country cover city description favouritesCount languages name pricePerDay pricePerMessage profile profileGallery profileNum profileUrl role services subscriptionEnabled verified personalDayOfBirth personalMonthOfBirth personalYearOfBirth personalCountry personalCity'
    const subscribers = await Subscription.find({
      model: id,
      ends: { $gte: now }
    })
      .populate([
        // 'subscriber',
        { path: 'subscriber', select: projection },
        'payments'
      ])
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

module.exports = { getSubscribersById }
