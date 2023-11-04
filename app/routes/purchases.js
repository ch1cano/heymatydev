/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const Bundle = require('../models/bundle')
const User = require('../models/user')
const Payment = require('../models/payment')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const moment = require('moment')
const holdDays = 1 // Additional days to hold payment by default

// // Get all my bundles
// router.get('/', requireAuth, roleAuthorization(['girl']), async (req, res) => {
//   try {
//     const userId = req.user._id
//     if (!userId) {
//       return res
//         .status('400')
//         .send({ error: { message: `Пользователь указан неверно` } })
//     }

//     const q = {
//       user: userId
//     }

//     const bundles = await Bundle.find(q)

//     const count = bundles.length

//     return res.status(200).json({
//       bundles,
//       total: count,
//       message: `Список всех пакетов`
//     })
//   } catch (error) {
//     handleError(res, error)
//   }
// })

// // Get a bundle
// router.get(
//   '/:bundleId',
//   requireAuth,
//   roleAuthorization(['girl']),
//   async (req, res) => {
//     try {
//       const userId = req.user._id
//       const { bundleId } = req.params
//       if (!userId) {
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь указан неверно` } })
//       }

//       const q = {
//         user: userId,
//         _id: bundleId
//       }

//       const bundle = await Bundle.findOne(q)

//       if (!bundle) {
//         return res
//           .status('400')
//           .send({ error: { message: `Невозможно найти пакет` } })
//       }

//       return res.status(200).json({
//         bundle,
//         message: `Пакет`
//       })
//     } catch (error) {
//       handleError(res, error)
//     }
//   }
// )

// Buy a bundle
router.post(
  '/bundle',
  requireAuth,
  roleAuthorization(['user']),
  async (req, res) => {
    try {
      const { bundleId } = req.body
      const userId = req.user._id
      if (!userId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }
      if (!bundleId) {
        return res
          .status('400')
          .send({ error: { message: `Неверно указан пакет` } })
      }

      const user = await User.findById(userId).exec()
      if (!user) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь не найден` } })
      }

      const bundle = await Bundle.findById(bundleId).exec()
      if (
        !bundle ||
        !bundle.isActive ||
        (bundle.type === 'limited' && bundle.amount < 1)
      ) {
        return res.status('400').send({ error: { message: `Пакет не найден` } })
      }

      if (user.balance < bundle.price) {
        return res
          .status('400')
          .send({ error: { message: `Недостаточно средств` } })
      }
      user.balance -= bundle.price
      const bindex = user.messageBundles.findIndex((b) => {
        return b.model.toString() === bundle.user.toString()
      })
      if (bindex > -1) {
        user.messageBundles[bindex].messages += bundle.qty
      } else {
        user.messageBundles.push({
          model: bundle.user,
          messages: bundle.qty
        })
      }
      const savedUser = await user.save()

      let savedBundle
      if (bundle.type === 'limited') {
        bundle.amount -= 1
        if (bundle.amount < 1) {
          bundle.isActive = false
        }
        savedBundle = await bundle.save()
      }
      const newPayment = new Payment({
        registerDate: moment().toDate(),
        periodStart: moment().toDate(),
        periodEnd: moment().toDate(),
        amount: bundle.price,
        finished: false,
        bundle: bundle._id,
        plannedPayoutDate: moment().add(holdDays, 'days').toDate(),
        from: user,
        to: bundle.user
      })
      await newPayment.save(async (err) => {
        if (err) {
          return res
            .status('400')
            .send({ error: { message: `Ошибка при сохранении платежа` } })
        }
        bundle.payments.push(newPayment)
        await bundle.save()
      })

      return res.status(200).json({
        savedUser,
        savedBundle,
        message: `Пакет успешно куплен`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// // Delete a bundle
// router.delete(
//   '/:bundleId',
//   requireAuth,
//   roleAuthorization(['girl']),
//   async (req, res) => {
//     try {
//       const { bundleId } = req.params
//       const userId = req.user._id
//       if (!userId) {
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь указан неверно` } })
//       }
//       if (!bundleId) {
//         return res
//           .status('400')
//           .send({ error: { message: `Неверно указан пакет` } })
//       }

//       const checkBundle = await Bundle.findOne({ user: userId, _id: bundleId })
//       if (!checkBundle) {
//         return res
//           .status('400')
//           .send({ error: { message: `Нельзя удалить этот пакет` } })
//       }

//       await checkBundle.delete()
//       return res.status(200).json({
//         message: `Пакет успешно удален`
//       })
//     } catch (error) {
//       handleError(res, error)
//     }
//   }
// )

// // Get all active bundles of model
// router.get(
//   '/model/:modelId',
//   // requireAuth,
//   // roleAuthorization(['user', 'girl']),
//   async (req, res) => {
//     try {
//       const { modelId } = req.params
//       if (!modelId) {
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь указан неверно` } })
//       }

//       const q = {
//         user: modelId,
//         isActive: true
//       }

//       const bundles = await Bundle.find(q)

//       const count = bundles.length

//       return res.status(200).json({
//         bundles,
//         total: count,
//         message: `Список всех пакетов модели`
//       })
//     } catch (error) {
//       handleError(res, error)
//     }
//   }
// )

module.exports = router
