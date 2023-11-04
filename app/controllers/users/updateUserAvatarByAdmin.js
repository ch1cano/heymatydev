const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUserAvatarByAdmin = async (req, res) => {
  try {
    const { file } = req
    const userId = req.params.id

    if (!file) {
      return res.status(400).json({
        message: 'Не указан файл'
      })
    }
    if (!userId) {
      return res.status(400).json({
        message: 'Не указан пользователь'
      })
    }
    const data = {
      profile: file
    }

    const userUpdate = await User.findByIdAndUpdate(userId, data, {
      new: true
    })

    return res
      .status(200)
      .json({ message: 'User Profile updated successfully', userUpdate })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateUserAvatarByAdmin }
