const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const Transaction = require('../models/transactions')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

router.get(
  '/get-my-transactions',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    // Create a new customer object
    try {
      const transactions = await Transaction.find({ user: req.user._id })
      if (!transactions && !req.user._id) {
        return res
          .status('400')
          .send({ error: { message: `transactions not exist` } })
      }

      res.send({
        transactions,
        message: 'Транзакции пользователя'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

module.exports = router
