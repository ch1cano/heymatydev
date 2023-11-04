const Tariff = require('../../../models/tariff')

const updateTariffInDB = async (id, data, userId) => {
  // eslint-disable-next-line no-unused-vars
  try {
    const updateResult = await Tariff.updateOne({ _id: id, user: userId }, data)
    if (updateResult.nModified === 0) {
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

module.exports = { updateTariffInDB }
