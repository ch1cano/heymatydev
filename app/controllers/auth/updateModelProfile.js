/* eslint-disable max-statements */
const User = require('../../models/user')
const Services = require('../../models/services')
const Language = require('../../models/language')

const { handleError } = require('../../middleware/utils')
const { validateProfileUrl } = require('./validators/validateProfileUrl')
const {
  checkIfProfileUrlIsUnique
} = require('./validators/checkIfProfileUrlIsUnique')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateModelProfile = async (req, res) => {
  try {
    const {
      name,
      // age,
      // country,
      // state,
      // city,
      description,
      pricePerDay,
      pricePerMessage,
      profileUrl,
      subscriptionEnabled
    } = req.body
    let {
      // services,
      languages
    } = req.body
    // services = JSON.parse(services)
    languages = JSON.parse(languages)

    if (!pricePerDay) {
      return res.status(400).json({ message: 'Send correct price' })
    }
    if (!pricePerMessage) {
      return res.status(400).json({ message: 'Send correct price' })
    }
    // if (services.length === 0) {
    //   return res.status(400).json({ message: 'Send At least one service' })
    // }
    if (languages.length === 0) {
      return res.status(400).json({ message: 'Send At least one Language' })
    }

    let flag = false
    // await Promise.all(
    //   services.map(async (service) => {
    //     const serviceCheck = await Services.findById(service)
    //     if (!serviceCheck) {
    //       flag = true
    //     }
    //   })
    // )

    // if (flag === true) {
    //   return res.status(400).json({ message: 'Please sent the valid service.' })
    // }

    await Promise.all(
      languages.map(async (language) => {
        const languageCheck = await Language.findById(language)
        if (!languageCheck) {
          flag = true
        }
      })
    )

    if (flag === true) {
      return res
        .status(400)
        .json({ message: 'Please sent the valid language.' })
    }

    const data = {
      name,
      // age,
      // services,
      languages,
      // country,
      // state,
      // city,
      description,
      pricePerDay,
      pricePerMessage,
      subscriptionEnabled
    }
    if (profileUrl) {
      const profileUrlValidation = validateProfileUrl(profileUrl)
      // console.log(profileUrl, profileUrlValidation)
      if (profileUrlValidation.length) {
        return res.status(400).json({ message: profileUrlValidation.join(' ') })
      }
      const profileUrlToSave = await checkIfProfileUrlIsUnique(
        req.user._id,
        profileUrl
      )
      data.profileUrl = profileUrlToSave
    }
    // console.log(data)
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

module.exports = { updateModelProfile }
