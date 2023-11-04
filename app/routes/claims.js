/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
// const Transaction = require('../models/transactions')
const User = require('../models/user')
const Claim = require('../models/claim')
const Payment = require('../models/payment')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

// Get user's claims
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    const { type = 'payment' } = req.query
    try {
      const claims = await Claim.find({
        user: req.user._id,
        type
      })
      if (!claims && !req.user._id) {
        return res
          .status('400')
          .send({ error: { message: `claims not found` } })
      }

      res.send({
        claims,
        message: 'Жалобы пользователя'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Get all claims
router.get(
  '/all',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { page, limit, isCompleted, types, statuses, user, target, sort } =
        req.query

      const q = {}

      if (statuses) {
        q.status = { $in: statuses }
      }
      if (types) {
        q.type = { $in: types }
      }
      if (user) {
        q.user = user
      }
      if (target) {
        q.target = target
      }

      if (isCompleted) {
        q.isCompleted = isCompleted
      }
      // console.log(q)

      // if (email) {
      //   q.email = {
      //     $regex: email
      //   }
      // }
      let sortq = {
        createdAt: -1
      }

      if (sort) {
        sortq = {}
        const sortKey = sort.replace(/[\+-]/g, '')
        const sortDir = parseInt(`${sort[0]}1`)
        sortq[sortKey] = sortDir
      }

      const claims = await Claim.find(q)
        .sort(sortq)
        .populate(['user', 'lastCheckedBy', 'target'])
        // .select('_id age name email profile verified role')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Claim.find(q).countDocuments()

      return res.status(200).json({
        claims,
        totalPages: Math.ceil(count / limit),
        total: count,
        currentPage: page,
        message: `Список всех жалоб`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Create claim
router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { type, title, description, targetId, details } = req.body
      if (!title || !description) {
        return res
          .status('400')
          .send({ error: { message: `Заполните заголовок и описание` } })
      }
      const userId = req.user._id
      if (!req.user._id) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }
      const user = await User.findById(req.user._id)
      if (!user) {
        console.log(`user not exist`)
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }

      const target = await User.findById(targetId)
      if (!target) {
        console.log(`target not exist`)
        return res
          .status('400')
          .send({ error: { message: `Субъект жалобы не найден` } })
      }

      if (type === 'payment' && details.paymentId) {
        const checkPayment = await Payment.findById(details.paymentId)
        if (!checkPayment) {
          console.log(`payment not exist`)
          return res
            .status('400')
            .send({ error: { message: `Платеж не найден` } })
        }
        if (checkPayment.finished) {
          console.log(`payment already finished`)
          return res
            .status('400')
            .send({ error: { message: `Платеж уже завершен` } })
        }
        if (checkPayment.claim) {
          console.log(`payment already claimed`)
          return res
            .status('400')
            .send({ error: { message: `Платеж уже обжалован или обжалуется` } })
        }
      }

      const newClaim = new Claim({
        status: 'new',
        statusText: 'Жалоба создана',
        type,
        title,
        description,
        details,
        user: userId,
        target: targetId
      })

      await newClaim.save()

      if (type === 'payment' && details.paymentId) {
        // putting payment on hold
        await Payment.findByIdAndUpdate(details.paymentId, {
          $set: {
            holded: true,
            claim: newClaim._id
          }
        })
      }

      res.send({
        newClaim,
        message: 'Жалоба создана'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Mark claim as seen
router.post(
  '/seen/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user._id
      const claimCheck = await Claim.findOne({ _id: id, status: 'new' })
      if (!claimCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя пометить данную жалобу` })
      }

      const claimUpdated = await Claim.findByIdAndUpdate(
        id,
        {
          status: 'seen',
          lastCheckedBy: userId
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy', 'target'])
        .exec()

      return res
        .status(200)
        .json({ message: `Жалоба успешно помечена прочитанной`, claimUpdated })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

// Mark claim as approved
router.post(
  '/approve/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user._id
      const { statusText } = req.body
      if (!statusText) {
        return res
          .status(400)
          .json({ message: `Необходимо ввести комментарий` })
      }
      const claimCheck = await Claim.findOne({
        _id: id,
        status: { $in: ['new', 'seen'] }
      })
      if (!claimCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя утвердить данную жалобу` })
      }

      const user = await User.findById(claimCheck.user)
      if (!user) {
        console.log(`user not exist`)
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }

      if (claimCheck.type === 'payment') {
        if (!claimCheck.details || !claimCheck.details.paymentId) {
          return res
            .status(400)
            .json({ message: `Недостаточно данных в жалобе` })
        }

        // blocking payment to be payed to model
        const updatedPayment = await Payment.findByIdAndUpdate(
          claimCheck.details.paymentId,
          {
            $set: {
              finished: true
            }
          },
          { new: true }
        )

        // refunding user
        const { amount } = updatedPayment
        await User.findByIdAndUpdate(claimCheck.user, {
          $set: {
            balance: Math.floor(parseInt(user.balance) + parseInt(amount))
          }
        })
      }

      const claimUpdated = await Claim.findByIdAndUpdate(
        id,
        {
          status: 'approved',
          lastCheckedBy: userId,
          statusText
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy', 'target'])
        .exec()

      return res
        .status(200)
        .json({ message: `Жалоба успешно утверждена`, claimUpdated })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

// Mark claim as rejected
router.post(
  '/reject/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user._id
      const { statusText } = req.body
      if (!statusText) {
        return res
          .status(400)
          .json({ message: `Необходимо ввести комментарий` })
      }
      const claimCheck = await Claim.findOne({
        _id: id,
        status: { $in: ['new', 'seen'] }
      })
      if (!claimCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя отклонить данную жалобу` })
      }

      const user = await User.findById(claimCheck.user)
      if (!user) {
        console.log(`user not exist`)
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }

      if (claimCheck.type === 'payment') {
        if (!claimCheck.details || !claimCheck.details.paymentId) {
          return res
            .status(400)
            .json({ message: `Недостаточно данных в жалобе` })
        }
        await Payment.findByIdAndUpdate(claimCheck.details.paymentId, {
          $set: {
            holded: false
          }
        })
      }

      const claimUpdated = await Claim.findByIdAndUpdate(
        id,
        {
          status: 'rejected',
          lastCheckedBy: userId,
          statusText
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy', 'target'])
        .exec()

      return res.status(200).json({
        message: `Жалоба успешно отклонена`,
        claimUpdated
      })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

module.exports = router
