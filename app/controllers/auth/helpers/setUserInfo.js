/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req = {}) => {
  return new Promise((resolve) => {
    let user = {
      _id: req._id,
      name: req.name,
      email: req.email,
      emailConfirmed: req.emailConfirmed,
      emailConfirmationValidUntil: req.emailConfirmationValidUntil,
      role: req.role,
      verified: req.verified,
      blockExpires: req.blockExpires,
      messageBundles: req.messageBundles,
      balance: req.balance,
      subscribers: req.subscribers,
      subscribed: req.subscribed,
      subscriptionEnabled: req.subscriptionEnabled,
      profileUrl: req.profileUrl,
      profileGallery: req.profileGallery,
      age: req.age,
      pricePerDay: req.pricePerDay,
      pricePerMessage: req.pricePerMessage,
      services: req.services,
      languages: req.languages,
      profileNum: req.profileNum,
      profile: req.profile,
      cover: req.cover,
      city: req.city,
      country: req.country,
      description: req.description,
      state: req.state,
      personalDayOfBirth: req.personalDayOfBirth,
      personalMonthOfBirth: req.personalMonthOfBirth,
      personalYearOfBirth: req.personalYearOfBirth,
      personalCountry: req.personalCountry,
      personalCity: req.personalCity
    }

    // Adds verification for testing purposes
    if (process.env.NODE_ENV !== 'production') {
      user = {
        ...user,
        verification: req.verification
      }
    }
    resolve(user)
  })
}

module.exports = { setUserInfo }
