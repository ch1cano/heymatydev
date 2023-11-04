/* eslint-disable max-statements */
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const downgradeModerator = async (req, res) => {
  try {
    const { id } = req.params
    const userCheck = await User.findOne({ _id: id, role: 'moderator' })
    if (!userCheck) {
      return res.status(400).json({ message: `Нет модератора с заданным id` })
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        role: 'user'
      },
      { new: true }
    )

    return res.status(200).json({
      message: `Пользователь успешно понижен до статуса Пользователь`,
      userUpdated
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { downgradeModerator }
