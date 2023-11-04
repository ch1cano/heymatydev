const moongose = require('mongoose')

const Services = new moongose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
module.exports = moongose.model('services', Services)
