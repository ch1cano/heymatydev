const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const User = require('../models/user')
const Transaction = require('../models/transactions')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
var coinbase = require('coinbase-commerce-node')
var Client = coinbase.Client
Client.init(process.env.COINBASE_COMMERCE_API_KEY)
var Charge = coinbase.resources.Charge

router.get('/info', (req, res) => {
  const info = {
    siteComission: {
      data: process.env.SITE_COMISSION,
      description: 'Размер комиссии сайта в процентах'
    },
    bitapsComissionIn: {
      data: process.env.BITAPS_COMISSION_IN,
      description: 'Размер комиссии blockchain на ввод средств в satoshi'
    },
    bitapsComissionOut: {
      data: process.env.BITAPS_COMISSION_OUT,
      description: 'Размер комиссии blockchain на вывод средств в satoshi'
    }
  }
  res.send(info)
})

router.post('/webhook', async (req, res) => {
  const { body, params, query } = req
  const { event } = body
  const { type, id: eventId, data: eventData } = event
  const { code, metadata, pricing } = eventData
  //body
  //   {
  //     "id": 1,
  //     "scheduled_for": "2017-01-31T20:50:02Z",
  //     "event": {
  //         "id": "24934862-d980-46cb-9402-43c81b0cdba6",
  //         "resource": "event",
  //         "type": "charge:created",
  //         "api_version": "2018-03-22",
  //         "created_at": "2017-01-31T20:49:02Z",
  //         "data": {
  //           "code": "66BEOV2A",
  //           "name": "The Sovereign Individual",
  //           "description": "Mastering the Transition to the Information Age",
  //           "hosted_url": "https://commerce.coinbase.com/charges/66BEOV2A",
  //           "created_at": "2017-01-31T20:49:02Z",
  //           "expires_at": "2017-01-31T21:49:02Z",
  //           "timeline": [
  //             {
  //               "time": "2017-01-31T20:49:02Z",
  //               "status": "NEW"
  //             }
  //           ],
  //           "metadata": {},
  //           "pricing_type": "no_price",
  //           "payments": [],
  //           "addresses": {
  //             "bitcoin": "mymZkiXhQNd6VWWG7VGSVdDX9bKmviti3U",
  //             "ethereum": "0x419f91df39951fd4e8acc8f1874b01c0c78ceba6"
  //           }
  //         }
  //     }
  // }

  try {
    const user = await User.findById(metadata.user_id)
    if (!user) {
      console.log(`user not exist`)
      return res.status('400').send({
        error: {
          message: `user not exist`
        }
      })
    }

    // Calculating the amount to proceed to user balance, applying all commisions and stuff
    let amountToProceed = 0
    if (parseInt(metadata.amount) > 0) {
      amountToProceed = metadata.amount
    } else {
      console.log(`payment amount is unset, aborting`)
      return res.status('400').send({
        error: {
          message: `payment amount is unset, aborting`
        }
      })
    }

    const existedTransaction = await Transaction.findOne({
      code
    })

    if (
      type === 'charge:confirmed' &&
      (!existedTransaction || !existedTransaction.confirmed)
    ) {
      await User.findByIdAndUpdate(user._id, {
        $set: { balance: parseInt(user.balance) + parseInt(amountToProceed) }
      })
      console.log('Adding amount to balance')
    }

    //Adding new transaction or updating existed one
    if (!existedTransaction) {
      const trans = new Transaction({
        code,
        confirmed: type === 'charge:confirmed',
        amount: parseInt(amountToProceed),
        direction: 'in',
        user: user._id,
        type
      })
      await trans.save()
    } else {
      await Transaction.updateOne(
        { code },
        {
          $set: {
            confirmed: type === 'charge:confirmed',
            amount: parseInt(amountToProceed),
            type
          }
        }
      )
    }

    res.status(200).send('Webhook Received')
  } catch (error) {
    handleError(res, error)
  }
  // res.send('ok')

  console.log(body, params, query)
})

router.post(
  '/charge-info/:code',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    try {
      const { body, params, query } = req
      const existedTransaction = await Transaction.findOne({
        code: params.code,
        user: req.user._id
      })
      if (!existedTransaction) {
        console.log(`transaction not exist`)
        return res
          .status('400')
          .send({ error: { message: `transaction not exist` } })
      }
      res.send(existedTransaction)
    } catch (error) {
      handleError(res, { error, code: 400 })
    }
  }
)

router.post(
  '/request-charge',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    const { body, params, query } = req
    console.log(`User ${req.user._id} requesting charge`)
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        console.log(`user not exist`)
        return res.status('400').send({ error: { message: `user not exist` } })
      }
      //Amount of money to make charge of, in US of America cents - 100 = 1 USD
      const { amount } = body
      if (parseInt(amount) < 1) {
        console.log(`invalid amount, it should be more than 1`)
        return res.status('400').send({
          error: {
            message: `invalid amount, it should be more than 1`
          },
          amount
        })
      }

      //amount in USD without commission
      const amountInUSD = (parseInt(amount) / 100).toFixed(2)
      //calculating the amount of USD to charge, including site comission
      const amountToChargeInUSD = (
        Math.ceil(
          parseInt(amount) * (1 + parseInt(process.env.SITE_COMISSION) / 100)
        ) / 100
      ).toFixed(2)

      const chargeObj = new Charge({
        description: `Add ${amountInUSD} USD to user ${req.user._id} balance`,
        metadata: {
          user_id: req.user._id,
          amount,
          amountInUSD,
          amountToChargeInUSD
        },
        local_price: {
          amount: `${amountToChargeInUSD}`,
          currency: 'USD'
        },
        name: 'Add to a balance',
        pricing_type: 'fixed_price'
      })

      const charge = await chargeObj.save()
      res.send(charge)
    } catch (error) {
      handleError(res, { error, code: error.code })
    }
  }
)

module.exports = router
