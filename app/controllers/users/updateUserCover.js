const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUserCover = async (req, res) => {
  try {
    const { file } = req

    if (!file) {
      return res.status(400).json({
        message: 'Не указан файл'
      })
    }
    const data = {
      cover: file
    }

    const userUpdate = await User.findByIdAndUpdate(req.user._id, data, {
      new: true
    })

    return res
      .status(200)
      .json({ message: 'User Profile updated successfully', userUpdate })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateUserCover }
