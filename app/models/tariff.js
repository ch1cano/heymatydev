const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TariffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)
TariffSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Tariff', TariffSchema)
