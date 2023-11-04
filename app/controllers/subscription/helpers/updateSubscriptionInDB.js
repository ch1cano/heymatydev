const Subscription = require('../../../models/subscription')

const updateSubscriptionInDB = async (id, data) => {
  // eslint-disable-next-line no-unused-vars
  try {
    const updateResult = await Subscription.updateOne({ _id: id }, data)
    if (updateResult.updatedCount === 0) {
      throw new Error('Item with this id not found')
    }
    return {
      ok: true
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { updateSubscriptionInDB }
