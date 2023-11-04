const moongose = require('mongoose')

const onlineUsers = new moongose.Schema({
  userId: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
  },
  modelId: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
module.exports = moongose.model('favorites', onlineUsers)
