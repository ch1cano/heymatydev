const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const SubscriptionSchema = new mongoose.Schema(
  {
    // Stores as UTC
    starts: {
      type: Date,
      required: true
    },
    ends: {
      type: Date,
      required: true
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
      }
    ],
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
module.exports = mongoose.model('Sub', SubscriptionSchema)
