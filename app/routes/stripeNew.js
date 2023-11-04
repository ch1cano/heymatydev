const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const passport = require('passport')
const { roleAuthorization } = require('../controllers/auth')
const User = require('../models/user')
const PaymentIntent = require('../models/paymentIntent')
const { handleError } = require('../middleware/utils')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

router.use((req, res, next) => {
  if (req.originalUrl === '/stripeNew/webhook') {
    next()
  } else {
    bodyParser.json()(req, res, next)
  }
})

// Webhook handler for asynchronous events.
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event
    try {
      const payload = req.body
      const payloadString = JSON.stringify(payload, null, 2)
      const secret = process.env.STRIPE_WEBHOOK_SECRET_KEY
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret
      })
      event = stripe.webhooks.constructEvent(payloadString, header, secret)
    } catch (err) {
      console.log(err)
      console.log(`⚠️  Webhook signature verification failed.`)
      console.log(
        `⚠️  Check the env file and enter the correct webhook secret.`
      )
      return res.sendStatus(400)
    }
    let paymentIntentObject = null
    let paymentIntent = null
    // Handle the event
    switch (event.type) {
      case 'payment_intent.amount_capturable_updated':
      case 'payment_intent.canceled':
      case 'payment_intent.created':
      case 'payment_intent.partially_funded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.processing':
      case 'payment_intent.requires_action':
        paymentIntentObject = event.data.object
        paymentIntent = await PaymentIntent.findOne({
          stripeId: paymentIntentObject.id
        })

        paymentIntent.status = paymentIntentObject.status
        paymentIntent.save()
        break
      case 'payment_intent.succeeded':
        paymentIntentObject = event.data.object
        paymentIntent = await PaymentIntent.findOne({
          stripeId: paymentIntentObject.id
        }).populate('user')

        paymentIntent.status = paymentIntentObject.status
        paymentIntent.finished = true
        paymentIntent.save()
        paymentIntent.user.balance += paymentIntent.balanceAmount
        paymentIntent.user.save()
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true })
  }
)

router.get(
  '/create-payment-intent',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      handleError(res, 'user not exist')
    }

    let { amount } = req.query

    if (!amount) {
      handleError(res, 'Missing required param: amount')
    }

    amount *= 100

    const data = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    })

    const paymentIntent = new PaymentIntent({
      user: user.id,
      stripeId: data.id,
      status: data.status,
      payAmount: amount,
      balanceAmount: amount,
      commissionAmount: 0,
      commissionPercent: 0
    })

    await paymentIntent.save()

    res.json({ clientSecret: data.client_secret })
  }
)

router.get(
  '/payment-intent/:_id',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
      handleError(res, 'user not exist')
    }
    const { _id } = req.params
    const paymentIntent = await PaymentIntent.findOne({ _id, user: user.id })
    if (!paymentIntent) {
      handleError(res, 'PaymentIntent not exist')
    }
    try {
      const data = await stripe.paymentIntents.retrieve(paymentIntent.stripeId)
      res.json({
        clientSecret: data.client_secret,
        payAmount: paymentIntent.payAmount / 100
      })
    } catch (err) {
      handleError(res, err)
    }
  }
)

router.get(
  '/payment-intent-list',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
      handleError(res, 'user not exist')
    }
    const paymentIntentList = await PaymentIntent.find({ user: user.id })
      .sort({
        createdAt: -1
      })
      .limit(20)
    res.json({ paymentIntentList })
  }
)

module.exports = router
