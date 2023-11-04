const User = require('../../../models/user')

const checkIfProfileUrlIsUnique = (userId, pu) => {
  return new Promise((resolve, reject) => {
    User.findOne({ profileUrl: pu, _id: { $ne: userId } }, (err, item) => {
      if (err) {
        reject(err)
      }
      if (!item) {
        resolve(pu)
      } else {
        reject({ code: 400, message: 'Profile Url already exist' })
      }
    })
  })
}

module.exports = { checkIfProfileUrlIsUnique }
