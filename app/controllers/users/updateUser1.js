/* eslint-disable max-statements */
const { handleError } = require('../../middleware/utils')
// const {
//   profileUrlExistsExcludingMyself
// } = require('../../middleware/profile_url')
const { validateProfileUrl } = require('../auth/validators/validateProfileUrl')
const {
  checkIfProfileUrlIsUnique
} = require('../auth/validators/checkIfProfileUrlIsUnique')
const User = require('../../models/user')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUser1 = async (req, res) => {
  try {
    // const { name, age, description } = req.body
    // console.log(req.body)
    const fields = [
      'name',
      'age',
      'description',
      'profileUrl',
      'country',
      'city'
    ]

    const data = {}

    for (const [key, value] of Object.entries(req.body)) {
      if (fields.includes(key)) {
        data[key] = value
      }
    }

    if (data.profileUrl) {
      const profileUrlValidation = validateProfileUrl(data.profileUrl)
      // console.log(data.profileUrl, profileUrlValidation)
      if (profileUrlValidation.length) {
        return res.status(400).json({ message: profileUrlValidation.join(' ') })
      }
      const profileUrlToSave = await checkIfProfileUrlIsUnique(
        req.user._id,
        data.profileUrl
      )
      data.profileUrl = profileUrlToSave
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

module.exports = { updateUser1 }
