const moongose = require('mongoose')

const claims = new moongose.Schema(
  {
    // isCompleted: {
    //   type: Boolean,
    //   default: false
    // },
    type: {
      type: String,
      enum: ['payment', 'chat', 'support'],
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'seen', 'approved', 'rejected'],
      required: true,
      default: 'new'
    },
    statusText: {
      type: String
    },
    user: {
      type: moongose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    target: {
      type: moongose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    lastCheckedBy: {
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
    details: {
      type: Object
    }
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('claims', claims)
