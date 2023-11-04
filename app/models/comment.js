const moongose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const commentSchema = new moongose.Schema(
  {
    userId: {
      type: moongose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    postId: {
      type: moongose.Schema.ObjectId,
      ref: 'posts',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxLength: 200
    },
    mentions: [
      {
        type: moongose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)
commentSchema.plugin(mongoosePaginate)

module.exports = moongose.model('Comment', commentSchema)
