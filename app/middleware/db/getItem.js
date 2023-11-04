const { itemNotFound } = require('../../middleware/utils')

/**
 * Gets item from database by id
 * @param {string} id - item id
 */
const getItem = (id = '', model = {}, post = {}) => {
  return new Promise((resolve, reject) => {
    const projection =
      '_id age blockExpires bundles country cover city description favouritesCount languages name pricePerDay pricePerMessage profile profileGallery profileNum profileUrl role services subscriptionEnabled verified personalDayOfBirth personalMonthOfBirth personalYearOfBirth personalCountry personalCity'
    model.findById(id, projection, async (err, item) => {
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

module.exports = { getItem }
