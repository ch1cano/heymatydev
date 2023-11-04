const User = require('../../models/user')

const { handleError } = require('../../middleware/utils')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateModelCover = async (req, res) => {
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

    const modelUpdate = await User.findByIdAndUpdate(req.user._id, data, {
      new: true
    })

    return res
      .status(200)
      .json({ updated: modelUpdate, message: 'Model updated Successfully!' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateModelCover }
