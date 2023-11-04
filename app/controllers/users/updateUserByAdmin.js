/* eslint-disable max-statements */
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, age, role } = req.body
    const userCheck = await User.findOne({ email })
    if (!userCheck) {
      return res.status(400).json({ message: 'Email не существует' })
    }
    const user = await User.findByIdAndUpdate(
      userCheck._id,
      {
        $set: {
          name,
          age,
          role
        }
      },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Пользователь успешно обновлен', user })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateUserByAdmin }
