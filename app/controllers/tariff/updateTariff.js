const { isIDGood } = require('../../middleware/utils')
const { handleError } = require('../../middleware/utils')
const { updateTariffInDB } = require('./heplers/updateTariffInDB')

/**
 * Update tariff
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateTariff = async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const { id, _id, ...tariffData } = req.body
    const { id: tariffId } = req.params
    const { _id: userId } = req.user
    await isIDGood(userId)
    const createResult = await updateTariffInDB(tariffId, tariffData, userId)
    if (!createResult.ok) {
      return res.status(400).json(createResult)
    }
    res.status(200).json(createResult)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateTariff }
