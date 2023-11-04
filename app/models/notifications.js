const moongose = require('mongoose')

const Notifications = new moongose.Schema({
  user: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
  readable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
module.exports = moongose.model('notifications', Notifications)
