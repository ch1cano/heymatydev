const Subscription = require('../../../models/sub')

const checkSubscription = async (subscriberId, modelId) => {
  try {
    const now = new Date()
    const sub = await Subscription.findOne({
      model: modelId,
      subscriber: subscriberId,
      ends: { $gte: now }
    })
      .populate('payments')
      .lean(true)
    if (sub)
      return {
        ok: true,
        data: sub
      }
    return {
      ok: true,
      data: false
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { checkSubscription }
