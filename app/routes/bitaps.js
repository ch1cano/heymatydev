/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const { resolve } = require('path')
const User = require('../models/user')
const Transaction = require('../models/transactions')
const Receipt = require('../models/receipt')
const bodyParser = require('body-parser')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const Bitaps = require('../controllers/bitaps/helpers/bitaps')
const bitapsHandler = new Bitaps()

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

router.get('/callback-link/:id', (req, res) => {
  const { body, params, query } = req
  if (params.id === 'domain-confirm') {
    res.send(process.env.BITAPS_AUTH_CODE)
  } else {
    res.send('ok')
  }
})

router.post('/callback-link/:id', async (req, res) => {
  //params.id === "master-wallet"
  //params.id === "master-address"
  const { body, params, query } = req
  if (params.id === 'master-wallet') {
    const { tx_hash, event, tx_out, amount } = body
    const trans = await Transaction.findOne({ txId: tx_hash })
    if (trans && !trans.confirmed) {
      const user = await User.findById(trans.user)
      await Transaction.updateOne(
        { txId: tx_hash },
        {
          $set: {
            confirmed: event === 'wallet payment confirmed',
            confirmations: parseInt(tx_out),
            status: event
          }
        }
      )
      if (event === 'wallet payment confirmed') {
        await User.findByIdAndUpdate(trans.user, {
          $set: {
            unconfirmedBalance: Math.floor(
              parseInt(user.unconfirmedBalance) - parseInt(trans.amount)
            )
          }
        })
      }
    }
    res.send('ok')
  } else if (params.id === 'domain-confirm') {
    res.send(process.env.BITAPS_AUTH_CODE)
  } else if (params.id === 'payment-address') {
    try {
      const user = await User.findOne({ inBTCAddress: body.address })
      if (!user) {
        console.log(`user with ${body.address} input BTC address not exist`)
        return res.status('400').send({
          error: {
            message: `user with ${body.address} input BTC address not exist`
          }
        })
      }
      if (user.paymentCode !== body.code) {
        console.log(
          `payment code mismatch, aborting`,
          user.paymentCode,
          body.code
        )
        return res.status('400').send({
          error: {
            message: `payment code mismatch, aborting`
          }
        })
      }

      // Calculating the amount to proceed to user balance, applying all commisions and stuff
      let amountToProceed = 0
      if (parseInt(body.amount) > 0) {
        const amountWithoutBitapsCommission = parseInt(
          parseInt(body.amount) - parseInt(process.env.BITAPS_COMISSION_IN)
        )
        amountToProceed = Math.floor(
          amountWithoutBitapsCommission -
            (Math.abs(amountWithoutBitapsCommission) *
              parseInt(process.env.SITE_COMISSION)) /
              100
        )
      } else {
        console.log(`payment amount is unset, aborting`)
        return res.status('400').send({
          error: {
            message: `payment amount is unset, aborting`
          }
        })
      }

      // The amount to proceed, after all comissions, is 0 or less - aborting
      if (amountToProceed <= 0) {
        console.log(`payment to process is zero or below zero, aborting`)
        return res.status('400').send({
          error: {
            message: `payment to process is zero or below zero, aborting`
          }
        })
      }

      const existedTransaction = await Transaction.findOne({
        txId: body.tx_hash
      })

      //checking if there is no transaction and callback with unconfirmed status, if so - adding funds to user's unconfirmedBalance
      if (body.event !== 'confirmed' && !existedTransaction) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            unconfirmedBalance:
              parseInt(user.unconfirmedBalance) + parseInt(amountToProceed)
          }
        })
        console.log(
          'New transaction, unconfirmed, adding amount to unconfirmed balance'
        )
      }
      //checking if there is no transaction and callback with confirmed status, if so - adding funds to user's balance directly
      else if (body.event === 'confirmed' && !existedTransaction) {
        await User.findByIdAndUpdate(user._id, {
          $set: { balance: parseInt(user.balance) + parseInt(amountToProceed) }
        })
        console.log('New transaction, confirmed, adding amount to balance')
      }
      //checking if the transaction was unconfirmed and became confirmed, if so - adding funds to user's balance and increasing unconfirmedBalance
      else if (body.event === 'confirmed' && !existedTransaction.confirmed) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            balance: parseInt(user.balance) + parseInt(amountToProceed),
            unconfirmedBalance:
              parseInt(user.unconfirmedBalance) - parseInt(amountToProceed)
          }
        })
        console.log(
          'Existed transaction, confirmed, adding amount to balance, substracting from unconfirmed balance'
        )
      }

      //Adding new transaction or updating existed one
      if (!existedTransaction) {
        const trans = new Transaction({
          txId: body.tx_hash,
          confirmed: body.event === 'confirmed',
          amount: parseInt(amountToProceed),
          direction: 'in',
          user: user._id,
          confirmations: parseInt(body.confirmations),
          status: body.event
        })
        await trans.save()
      } else {
        await Transaction.updateOne(
          { txId: body.tx_hash },
          {
            $set: {
              confirmed: body.event === 'confirmed',
              amount: parseInt(amountToProceed),
              confirmations: parseInt(body.confirmations),
              status: body.event
            }
          }
        )
      }
      console.log('confirming to bitaps')
      res.send(body.invoice)
    } catch (error) {
      handleError(res, error)
    }
    // res.send('ok')
  }
  console.log(body, params, query)
})

// router.get('/config', async (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
//   })
// })

router.post(
  '/create-in-btc-address',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    console.log(`Making new payment address for user ${req.user._id}`)
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        return res.status('400').send({ error: { message: `user not exist` } })
      }
      if (user.inBTCAddress) {
        return res.status('400').send({
          error: {
            message: `user already has in BTC Address - ${user.inBTCAddress}`
          }
        })
      }
      const newPaymentAddress = await bitapsHandler.createPaymentAddress()
      await User.findByIdAndUpdate(user._id, {
        $set: {
          inBTCAddress: newPaymentAddress.address,
          paymentCode: newPaymentAddress.payment_code,
          invoice: newPaymentAddress.invoice
        }
      })

      res.send({
        paymentAddress: newPaymentAddress.address,
        message: 'Новый адрес для оплаты создан'
      })
    } catch (error) {
      handleError(res, { error, code: 400 })
    }
  }
)

router.post(
  '/request-payment',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    const { body, params, query } = req
    console.log(`User ${req.user._id} requesting payment`)
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        console.log(`user not exist`)
        return res.status('400').send({ error: { message: `user not exist` } })
      }
      if (!user.outBTCAddress) {
        console.log(`user hasn't out BTC Address`)
        return res.status('400').send({
          error: {
            message: `user hasn't out BTC Address`
          }
        })
      }
      const { amount } = body
      if (
        parseInt(amount) > parseInt(user.balance) ||
        parseInt(amount) <= parseInt(process.env.BITAPS_COMISSION_OUT)
      ) {
        console.log(
          `user hasn't enougth balance or amount is less than minimum amount, requested ${amount}, balance ${user.balance}`
        )
        return res.status('400').send({
          error: {
            message: `user hasn't enougth balance or amount is less than minimum amount, requested ${amount}, balance ${user.balance}`
          },
          balance: user.balance,
          amount
        })
      }

      const amountToRedeem = Math.floor(
        parseInt(amount) - parseInt(process.env.BITAPS_COMISSION_OUT)
      )
      const newPaymentRequest = await bitapsHandler.sendPaymentToUser(
        user.outBTCAddress,
        user._id,
        amountToRedeem
      )

      if (newPaymentRequest && newPaymentRequest.tx_list) {
        newPaymentRequest.tx_list.forEach(async (tx) => {
          const trans = new Transaction({
            txId: tx.tx_hash,
            confirmed: false,
            amount: Math.floor(parseInt(amount)),
            // amount: parseInt(tx.amount),
            direction: 'out',
            user: user._id,
            confirmations: 0,
            status: null
          })
          await trans.save()
          await User.findByIdAndUpdate(user._id, {
            $set: {
              balance: Math.floor(parseInt(user.balance) - parseInt(amount)),
              unconfirmedBalance: Math.floor(
                parseInt(user.unconfirmedBalance) + parseInt(amount)
              )
            }
          })
          console.log(tx)
        })
        res.send({
          amount: parseInt(Math.floor(amount)),
          address: user.outBTCAddress,
          message: 'Новый запрос на выплату создан'
        })
      } else {
        console.log(`request gone wrong`)
        return res.status('400').send({
          error: {
            message: `request gone wrong`
          }
        })
      }
    } catch (error) {
      handleError(res, { error, code: 400 })
    }
  }
)

router.get(
  '/wallet-state',
  requireAuth,
  roleAuthorization(['user']), // TODO this is temporary solution, we should use admin restriction for this endpoint
  async (req, res) => {
    console.log(`Getting the main wallet state`)
    try {
      const walletState = await bitapsHandler.getWalletState()
      res.send({
        walletState,
        message: 'Состояние главного кошелька'
      })
    } catch (error) {
      handleError(res, { error, code: 400 })
    }
  }
)

module.exports = router
