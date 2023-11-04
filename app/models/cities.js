const moongose = require('mongoose')

const claims = new moongose.Schema(
  {
    name: {
      type: String
    },
    country: {
      type: moongose.Schema.ObjectId,
      ref: 'Country',
      required: true
    }
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('Cities', claims)
