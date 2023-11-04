/* eslint-disable max-statements */
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUsersAndModerators = async (req, res) => {
  try {
    const { page, limit, roles, email, sort } = req.query

    const q = {
      role: { $in: roles }
    }
    if (email) {
      q.email = {
        $regex: email
      }
    }
    let sortq = {
      createdAt: -1
    }

    if (sort) {
      sortq = {}
      const sortKey = sort.replace(/[\+-]/g, '')
      const sortDir = parseInt(`${sort[0]}1`)
      sortq[sortKey] = sortDir
    }

    const users = await User.find(q)
      .sort(sortq)
      .select('_id age name email profile verified role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find(q).countDocuments()

    users.map((user) => {
      if (user.profile) {
        user.profile.path = `${'https:' + '//'}${req.get('host')}//${
          user.profile.path
        }`
      }
    })

    return res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      total: count,
      currentPage: page,
      message: `Список всех пользователей`
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUsersAndModerators }
