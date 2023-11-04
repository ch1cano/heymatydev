/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
// const Transaction = require('../models/transactions')
const User = require('../models/user')
const Request = require('../models/request')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

// Get user's requests
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const requests = await Request.find({
        user: req.user._id,
        type: 'redeem'
      })
      if (!requests && !req.user._id) {
        return res
          .status('400')
          .send({ error: { message: `requests not found` } })
      }

      res.send({
        requests,
        message: 'Запросы пользователя'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Get all requests
router.get(
  '/all',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { page, limit, isCompleted, types, statuses, user, sort } =
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

      const requests = await Request.find(q)
        .sort(sortq)
        .populate(['user', 'lastCheckedBy'])
        // .select('_id age name email profile verified role')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Request.find(q).countDocuments()

      return res.status(200).json({
        requests,
        totalPages: Math.ceil(count / limit),
        total: count,
        currentPage: page,
        message: `Список всех запросов`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Create request
router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { type, title, description, details } = req.body
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

      if (!user.outBTCAddress) {
        console.log(`user hasn't out BTC Address`)
        return res.status('400').send({
          error: {
            message: `Не установлен адрес для вывода средств`
          }
        })
      }

      const { amount } = details
      if (!amount || parseInt(amount) > parseInt(user.balance)) {
        console.log(
          `incorrect amount, requested ${amount}, balance ${user.balance}`
        )
        return res.status('400').send({
          error: {
            message: `Некорректная сумма`
          },
          balance: user.balance,
          amount
        })
      }

      const newRequest = new Request({
        // isCompleted: false,
        status: 'new',
        statusText: 'Запрос создан',
        type,
        title,
        description,
        details,
        user: userId
      })

      await newRequest.save()

      await User.findByIdAndUpdate(user._id, {
        $set: {
          balance: Math.floor(parseInt(user.balance) - parseInt(amount))
        }
      })

      res.send({
        newRequest,
        message: 'Запрос создан'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Mark request as seen
router.post(
  '/seen/:id',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user._id
      const requestCheck = await Request.findOne({ _id: id, status: 'new' })
      if (!requestCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя пометить данный запрос` })
      }

      const requestUpdated = await Request.findByIdAndUpdate(
        id,
        {
          status: 'seen',
          lastCheckedBy: userId
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy'])
        .exec()

      return res
        .status(200)
        .json({ message: `Запрос успешно помечен прочитанным`, requestUpdated })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

// Mark request as approved
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
      const requestCheck = await Request.findOne({
        _id: id,
        status: { $in: ['new', 'seen'] }
      })
      if (!requestCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя утвердить данный запрос` })
      }

      const requestUpdated = await Request.findByIdAndUpdate(
        id,
        {
          status: 'approved',
          lastCheckedBy: userId,
          statusText
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy'])
        .exec()

      return res
        .status(200)
        .json({ message: `Запрос успешно утвержден`, requestUpdated })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

// Mark request as rejected
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
      const requestCheck = await Request.findOne({
        _id: id,
        status: { $in: ['new', 'seen'] }
      })
      if (!requestCheck) {
        return res
          .status(400)
          .json({ message: `Нельзя отклонить данный запрос` })
      }

      const user = await User.findById(requestCheck.user)
      if (!user) {
        console.log(`user not exist`)
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }

      const { amount } = requestCheck.details
      if (!amount || !parseInt(amount)) {
        console.log(`incorrect amount, requested ${amount}`)
        return res.status('400').send({
          error: {
            message: `Некорректная сумма`
          },
          amount
        })
      }

      await User.findByIdAndUpdate(requestCheck.user, {
        $set: {
          balance: Math.floor(parseInt(user.balance) + parseInt(amount))
        }
      })

      const requestUpdated = await Request.findByIdAndUpdate(
        id,
        {
          status: 'rejected',
          lastCheckedBy: userId,
          statusText
        },
        { new: true }
      )
        .populate(['user', 'lastCheckedBy'])
        .exec()

      return res.status(200).json({
        message: `Запрос успешно отклонен, средства возвращены на баланс`,
        requestUpdated
      })
    } catch (e) {
      return handleError(res, e)
    }
  }
)

module.exports = router
