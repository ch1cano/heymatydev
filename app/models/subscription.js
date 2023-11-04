const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const SubscriptionSchema = new mongoose.Schema(
  {
    // Stores as UTC
    activeUpTo: {
      type: Date,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    sum: {
      type: Number,
      required: true
    },
    tariff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tariff',
      required: true
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

SubscriptionSchema.plugin(mongoosePaginate)
SubscriptionSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('Subscription', SubscriptionSchema)
