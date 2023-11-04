/* eslint-disable max-statements */
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params
    const userCheck = await User.findOne({ _id: id, role: 'user' })
    if (!userCheck) {
      return res
        .status(400)
        .json({ message: `Нет обычного пользователя с заданным id` })
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        role: 'moderator'
      },
      { new: true }
    )

    return res.status(200).json({
      message: `Пользователь успешно повышен до статуса Модератор`,
      userUpdated
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { promoteUser }
