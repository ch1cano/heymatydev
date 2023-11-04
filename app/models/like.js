const moongose = require('mongoose')

const likeSchema = new moongose.Schema(
  {
    userId: {
      type: moongose.Schema.ObjectId,
      ref: 'User'
    },
    obj: {
      type: moongose.Schema.ObjectId
    }
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('Like', likeSchema)
