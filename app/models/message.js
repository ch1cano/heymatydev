const moongose = require('mongoose')
const Schema = moongose.Schema

const messageSchema = new Schema({
  type: {
    type: String,
    default: 'chat'
  },
  from: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: moongose.Schema.ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
  attachment: {
    type: Array,
    // {
    // images: {
    //   type: Array
    // },
    // videos: {
    //   type: Array
    // }
    // images: [
    //   {
    //     name: String,
    //     originalname: String,
    //     uploaded: Boolean,
    //     error: Boolean
    //   }
    // ],
    // videos: [
    //   {
    //     name: String,
    //     originalname: String,
    //     uploaded: Boolean,
    //     error: Boolean
    //   }
    // ]
    // },
    default: null
  },
  payment: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  donation: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

const Chat = moongose.model('message', messageSchema)

module.exports = Chat
