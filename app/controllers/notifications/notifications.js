const { handleError } = require('../../middleware/utils')
const Notification = require('../../models/notifications')

exports.allNotifications = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page, limit } = req.query

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // get total documents in the Notification collection
    const count = await Notification.find({
      isModerator: req.user._id
    }).countDocuments()

    // return response with notifications, total pages, and current page

    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.unreadableNotification = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page, limit } = req.query

    const notifications = await Notification.find({
      user: req.user._id,
      readable: false
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // get total documents in the Notification collection
    const count = await Notification.find({
      isModerator: req.user._id,
      readable: false
    }).countDocuments()

    // return response with notifications, total pages, and current page

    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.readableNotification = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page, limit } = req.query

    const notifications = await Notification.find({
      user: req.user._id,
      readable: true
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // get total documents in the Notification collection
    const count = await Notification.find({
      isModerator: req.user._id,
      readable: true
    }).countDocuments()

    // return response with notifications, total pages, and current page

    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.readNotification = async (req, res) => {
  try {
    const { id } = req.params
    const notificationRead = await Notification.findByIdAndUpdate(
      id,
      {
        readable: true
      },
      { new: true }
    )

    if (!notificationRead) {
      return res.status(200).json({
        message: 'Для данного ID нет уведомлений'
      })
    }

    return res
      .status(200)
      .json({ updated: notificationRead, message: 'Уведомление прочитано' })
  } catch (e) {
    return handleError(res, e)
  }
}
