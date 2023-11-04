const moongose = require('mongoose')

const Language = new moongose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
)
module.exports = moongose.model('language', Language)
