const moongose = require('mongoose')

const onlineUsers = new moongose.Schema({
  model: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
    // unique: true
  },
  user: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
    // unique: true
  },
  status: {
    type: String
  },
  message: {
    type: String
  }
})
module.exports = moongose.model('receipts', onlineUsers)
