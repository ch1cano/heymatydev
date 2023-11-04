const { itemNotFound } = require('../../middleware/utils')

/**
 * Get user profile by profileUrl
 * @param {string} url - profileUrl
 */
const getProfileByUrl = (url = '', model = {}, post = {}) => {
  return new Promise((resolve, reject) => {
    const filter = {
      $or: [
        {
          profileNum: {
            $eq: Number.parseInt(url) || 0
          }
        },
        {
          profileUrl: {
            $eq: url
          }
        }
      ]
    }
    if (url.match(/^[0-9a-fA-F]{24}$/)) {
      filter.$or.push({
        _id: {
          $eq: url
        }
      })
    }
    const projection =
      '_id age blockExpires bundles country cover city description favouritesCount languages name pricePerDay pricePerMessage profile profileGallery profileNum profileUrl role services subscriptionEnabled verified personalDayOfBirth personalMonthOfBirth personalYearOfBirth personalCountry personalCity'
    model.findOne(filter, projection, async (err, item) => {
      try {
        let meta
        await itemNotFound(err, item, 'NOT_FOUND')
        if (item.role === 'girl') {
          const posts = await post.find({ userId: item._id })
          if (posts) {
            const totalPosts = posts.length
            const openPosts = posts.filter((p) => p.isPublic).length
            const closedPosts = posts.filter((p) => !p.isPublic).length
            meta = { totalPosts, openPosts, closedPosts }
          }
        }
        resolve({ item, meta })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getProfileByUrl }
