const Tariff = require('../../../models/tariff')

const putTariffToDB = async (data) => {
  // eslint-disable-next-line no-unused-vars
  const { id, _id, ...tariffData } = data
  const tariff = new Tariff(tariffData)
  try {
    await tariff.save()
    return {
      ok: true,
      data: tariff
    }
  } catch (e) {
    console.error(e)
    return {
      ok: false,
      data: e.message
    }
  }
}

module.exports = { putTariffToDB }
