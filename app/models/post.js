const moongose = require('mongoose')

const onlineUsers = new moongose.Schema(
  {
    isPublic: {
      type: Boolean,
      default: false
    },
    userId: {
      type: moongose.Schema.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [
      {
        type: Object
      }
    ],
    videos: [
      {
        type: Object
      }
    ]
    // createdAt: {
    //   type: Date,
    //   default: Date.now()
    // }
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('posts', onlineUsers)
