const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const BundleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      maxLength: 50
    },
    type: {
      type: String,
      enum: ['unlimited', 'limited'],
      required: true,
      default: 'unlimited'
    },
    // only for limited bundles
    amount: {
      type: Number,
      default: 0
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
      }
    ]
  },
  {
    timestamps: true
  }
)

BundleSchema.plugin(mongoosePaginate)
BundleSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('Bundle', BundleSchema)
