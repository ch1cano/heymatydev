const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnTokenAdmin = (req = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    userAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const userInfo = await setUserInfo(user)
        // Returns data with access token
        resolve({
          token: generateToken(user._id),
          user: userInfo,
          permissions: [{  name:"languages" }, { name: "languages.create" }, { name: "languages.edit" }, { name: "languages.delete" },
            {  name:"service" }, { name: "service.create" }, { name: "service.edit" }, { name: "service.delete" }, { name: "models.delete" }, { name: "models.edit" }, { name: "models.create" }, { name: "models" }]

        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveUserAccessAndReturnTokenAdmin }
