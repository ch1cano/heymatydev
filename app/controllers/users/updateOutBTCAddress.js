const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateOutBTCAddress = async (req, res) => {
  try {
    // const { name, age, description } = req.body

    const fields = ['outBTCAddress']

    const data = {}

    for (const [key, value] of Object.entries(req.body)) {
      if (fields.includes(key)) data[key] = value
    }

    const userUpdate = await User.findByIdAndUpdate(req.user._id, data, {
      new: true
    })

    return res
      .status(200)
      .json({
        message: 'User outgoing BTC address updated successfully',
        userUpdate
      })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateOutBTCAddress }
