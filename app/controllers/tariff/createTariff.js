const { isIDGood } = require('../../middleware/utils')
const { handleError } = require('../../middleware/utils')
const { putTariffToDB } = require('./heplers/putTariffToDB')

/**
 * Create tariff
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createTariff = async (req, res) => {
  try {
    const tariffData = req.body
    const { _id: userId } = req.user
    await isIDGood(userId)
    const createResult = await putTariffToDB({ ...tariffData, user: userId })
    if (!createResult.ok) {
      return res.status(400).json(createResult)
    }
    res.status(200).json(createResult.data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createTariff }
