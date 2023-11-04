const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const { resolve } = require('path')
const User = require('../models/user')
const Receipt = require('../models/receipt')
const bodyParser = require('body-parser')
const { roleAuthorization } = require('../controllers/auth')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

// router.use(express.static(process.env.STATIC_DIR));
// Use JSON parser for all non-webhook routes.
router.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next()
  } else {
    bodyParser.json()(req, res, next)
  }
})

router.get('/', (req, res) => {
  const path = resolve(`${process.env.STATIC_DIR}/index.html`)
  res.sendFile(path)
})

router.get('/config', async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })
})

router.post(
  '/create-customer',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    // Create a new customer object
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        handleError(res, 'user not exist')
      }
      const customer = await stripe.customers.create({
        email: user.email
      })

      // save the customer.id as stripeCustomerId
      // in your database.

      res.send({ customer })
    } catch (error) {
      handleError(res, error)
    }
  }
)

router.post(
  '/create-subscription',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    // Set the default payment method on the customer
    const { model, money } = req.body
    const modelCheck = await User.findOne({ _id: model, role: 'girl' })
    if (!modelCheck) {
      return res
        .status('400')
        .send({ error: { message: 'Model is not exist against this id.' } })
    }
    try {
      await stripe.paymentMethods.attach(req.body.paymentMethodId, {
        customer: req.body.customerId
      })
    } catch (error) {
      return res.status('402').send({ error: { message: error.message } })
    }

    await stripe.customers.update(req.body.customerId, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId
      }
    })

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: req.body.customerId,
      items: [{ price: process.env[req.body.priceId] }],
      expand: ['latest_invoice.payment_intent', 'pending_setup_intent']
    })
    const receipt = new Receipt({
      model,
      user: req.user._id,
      status: 'debit',
      message: `You have successfully subscribed to the ${modelCheck.name} and price of ${money} is deducting from your account.`
    })
    await receipt.save()
    const receiptModel = new Receipt({
      user: model,
      status: 'credit',
      message: `${money} send in to your account. because ${req.user.name} has been subscribed you.`
    })
    await receiptModel.save()
    // update model balance

    await User.findByIdAndUpdate(
      model,
      {
        balance: modelCheck.balance + money
      },
      { new: true }
    )
    res.send(subscription)
  }
)

router.post('/retry-invoice', async (req, res) => {
  // Set the default payment method on the customer

  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId
    })
    await stripe.customers.update(req.body.customerId, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId
      }
    })
  } catch (error) {
    // in case card_decline error
    return res
      .status('402')
      .send({ result: { error: { message: error.message } } })
  }

  const invoice = await stripe.invoices.retrieve(req.body.invoiceId, {
    expand: ['payment_intent']
  })
  res.send(invoice)
})

router.post('/retrieve-upcoming-invoice', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(
    req.body.subscriptionId
  )

  const invoice = await stripe.invoices.retrieveUpcoming({
    subscription_prorate: true,
    customer: req.body.customerId,
    subscription: req.body.subscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        clear_usage: true,
        deleted: true
      },
      {
        price: process.env[req.body.newPriceId],
        deleted: false
      }
    ]
  })
  res.send(invoice)
})

router.post('/cancel-subscription', async (req, res) => {
  // Delete the subscription
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    )
    res.send(deletedSubscription)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/update-subscription', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(
    req.body.subscriptionId
  )
  const updatedSubscription = await stripe.subscriptions.update(
    req.body.subscriptionId,
    {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price: process.env[req.body.newPriceId]
        }
      ]
    }
  )

  res.send(updatedSubscription)
})

router.post('/retrieve-customer-payment-method', async (req, res) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(
    req.body.paymentMethodId
  )

  res.send(paymentMethod)
})
// Webhook handler for asynchronous events.
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET_KEY
      )
    } catch (err) {
      console.log(err)
      console.log(`⚠️  Webhook signature verification failed.`)
      console.log(
        `⚠️  Check the env file and enter the correct webhook secret.`
      )
      return res.sendStatus(400)
    }
    // Extract the object from the event.
    const dataObject = event.data.object

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case 'invoice.paid':
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        break
      case 'invoice.payment_failed':
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break
      case 'invoice.finalized':
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break
      case 'customer.subscription.deleted':
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break
      case 'customer.subscription.trial_will_end':
        // Send notification to your user that the trial will end
        break
      default:
      // Unexpected event type
    }
    res.sendStatus(200)
  }
)

module.exports = router
