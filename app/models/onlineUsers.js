const moongose = require('mongoose')

const onlineUsers = new moongose.Schema({
  userId: {
    type: moongose.Schema.ObjectId,
    ref: 'user'
    // unique: true
  },
  socketId: {
	  type: String
  }
})
module.exports = moongose.model('onlineUser', onlineUsers)
