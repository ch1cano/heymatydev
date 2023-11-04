const moongose = require('mongoose')

const Country = new moongose.Schema(
  {
    name: {
      type: String
    },
    cities: [
      {
        type: moongose.Schema.ObjectId,
        ref: 'Cities',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('Country', Country)
