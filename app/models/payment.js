const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const PaymentSchema = new mongoose.Schema(
  {
    // Stores as UTC
    registerDate: {
      type: Date,
      required: true
    },
    periodStart: {
      type: Date,
      required: true
    },
    periodEnd: {
      type: Date,
      required: true
    },
    plannedPayoutDate: {
      type: Date,
      required: true
    },
    actualPayoutDate: {
      type: Date
    },
    amount: {
      type: Number,
      required: true
    },
    finished: {
      type: Boolean,
      required: true,
      default: false
    },
    holded: {
      type: Boolean,
      default: false
    },
    sub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sub'
    },
    bundle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bundle'
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message'
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message'
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'claims'
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

PaymentSchema.plugin(mongoosePaginate)
PaymentSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('Payment', PaymentSchema)
