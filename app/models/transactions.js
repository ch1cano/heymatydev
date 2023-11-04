const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const TransactionSchema = new mongoose.Schema(
  {
    //for bitaps only
    txId: {
      type: String
    },
    //for coinbase only
    code: {
      type: String
    },
    //for bitaps only
    status: {
      type: String
      // unconfirmed, pending [n/m], confirmed, payout sent, payout confirmed
    },
    //for coinbase only
    type: {
      type: String
      // charge:created, charge:confirmed, charge:failed, charge:delayed, charge:pending, charge:resolved
    },
    confirmed: {
      type: Boolean,
      default: false,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      enum: ['in', 'out'],
      default: 'in',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    //for bitaps only
    confirmations: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

TransactionSchema.plugin(mongoosePaginate)
TransactionSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('Transaction', TransactionSchema)
