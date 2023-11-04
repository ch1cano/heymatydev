const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const User = require('../models/user')

const { upload } = require('../middleware/multer/multer')

const { handleError } = require('../middleware/utils')

const moment = require('moment')

/*
 * Get verification route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['girl']),
  trimRequest.all,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
      res.status(200).json(user)
    } catch (error) {
      handleError(res, error)
    }
  }
)

/*
 * Save ferification data
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['girl']),
  // trimRequest.all,
  upload.fields([
    { name: 'personalPassport', maxCount: 1 },
    { name: 'personalIDCardFront', maxCount: 1 },
    { name: 'personalIDCardBack', maxCount: 1 },
    { name: 'personalDriverLicenseFront', maxCount: 1 },
    { name: 'personalDriverLicenseBack', maxCount: 1 },
    { name: 'personalSelfie', maxCount: 1 }
  ]),
  // eslint-disable-next-line max-statements
  async (req, res) => {
    try {
      // const {
      //   personalFirstName,
      //   personalSecondName,
      //   personalFamilyName,
      //   personalBirthDate,
      //   personalSex,
      //   personalCountry,
      //   personalCity,
      //   personalStreet,
      //   personalBuilding,
      //   personalAppartment,
      //   personalZIP,
      //   personalIDExpirationDate,
      //   personalIDHasNoExpiration
      // } = req.body

      // const {
      //   personalPassport,
      //   personalIDCardFront,
      //   personalIDCardBack,
      //   personalDriverLicenseFront,
      //   personalDriverLicenseBack,
      //   personalSelfie
      // } = req.files

      // Remove check to be able to save interstep results

      // if (
      //   !personalFirstName ||
      //   !personalFamilyName ||
      //   !personalBirthDate ||
      //   !personalSex ||
      //   !personalCountry ||
      //   !personalCity ||
      //   !personalStreet ||
      //   !personalBuilding ||
      //   !personalZIP ||
      //   (!personalPassport &&
      //     (!personalIDCardFront || !personalIDCardBack) &&
      //     (!personalDriverLicenseFront || !personalDriverLicenseBack)) ||
      //   !personalSelfie ||
      //   (!personalIDExpirationDate && !personalIDHasNoExpiration)
      // ) {
      //   return handleError(res, { code: 400, message: 'fields_required' })
      // }

      // const dob = personalBirthDate && moment(personalBirthDate)
      // const expDate =
      //   personalIDExpirationDate && moment(personalIDExpirationDate)
      // console.log(req.body)

      const data = {}
      for (const field in req.body) {
        if (req.body[field] && req.body[field] !== 'null') {
          if (field === 'personalBirthDate') {
            data.personalDayOfBirth = moment(req.body[field]).date()
            data.personalMonthOfBirth = moment(req.body[field]).month()
            data.personalYearOfBirth = moment(req.body[field]).year()
          } else if (field === 'personalIDExpirationDate') {
            data.personalIDExpirationDay = moment(req.body[field]).date()
            data.personalIDExpirationMonth = moment(req.body[field]).month()
            data.personalIDExpirationYear = moment(req.body[field]).year()
          } else {
            data[field] = req.body[field]
          }
        }
      }

      for (const field in req.files) {
        if (req.files[field]) {
          data[field] = req.files[field]
        }
      }

      // console.log(data)

      // console.log(personalBirthDate)
      // const data = {
      //   personalFirstName,
      //   personalSecondName,
      //   personalFamilyName,
      //   personalSex,
      //   personalCountry,
      //   personalCity,
      //   personalStreet,
      //   personalBuilding,
      //   personalAppartment,
      //   personalZIP,
      //   personalPassport,
      //   personalIDCardFront,
      //   personalIDCardBack,
      //   personalDriverLicenseFront,
      //   personalDriverLicenseBack,
      //   personalIDHasNoExpiration,
      //   personalSelfie,
      //   personalDayOfBirth:
      //     personalBirthDate && moment(personalBirthDate).date(),
      //   personalMonthOfBirth:
      //     personalBirthDate && moment(personalBirthDate).month(),
      //   personalYearOfBirth:
      //     personalBirthDate && moment(personalBirthDate).year(),
      //   personalIDExpirationDay:
      //     personalIDExpirationDate && moment(personalIDExpirationDate).date(),
      //   personalIDExpirationMonth:
      //     personalIDExpirationDate && moment(personalIDExpirationDate).month(),
      //   personalIDExpirationYear:
      //     personalIDExpirationDate && moment(personalIDExpirationDate).year()
      // }

      const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
        new: true
      })
      res.status(200).json(updatedUser)
    } catch (error) {
      handleError(res, error)
    }
  }
)

module.exports = router
