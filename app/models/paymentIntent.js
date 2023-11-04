const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const PaymentIntentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      required: true
    },
    stripeId: {
      type: String,
      required: true
    },
    payAmount: {
      type: Number,
      required: true
    },
    balanceAmount: {
      type: Number,
      required: true
    },
    commissionAmount: {
      type: Number,
      required: true
    },
    commissionPercent: {
      type: Number,
      required: true
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

PaymentIntentSchema.plugin(mongoosePaginate)
PaymentIntentSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('PaymentIntent', PaymentIntentSchema)
