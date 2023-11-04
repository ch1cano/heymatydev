/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const Message = require('../models/message')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

// Get all messages
router.get(
  '/all',
  requireAuth,
  roleAuthorization(['admin', 'moderator']),
  async (req, res) => {
    try {
      const { me, notme, fromDate, toDate, sort } = req.query

      if (!me || !notme || !fromDate || !toDate) {
        return res
          .status('400')
          .send({ error: { message: `Не заполнены необходимые данные` } })
      }
      const q = {}

      q.$or = [
        {
          from: me,
          to: notme
        },
        {
          from: notme,
          to: me
        }
      ]
      q.createdAt = { $gt: fromDate, $lt: toDate }

      let sortq = {
        createdAt: -1
      }

      if (sort) {
        sortq = {}
        const sortKey = sort.replace(/[\+-]/g, '')
        const sortDir = parseInt(`${sort[0]}1`)
        sortq[sortKey] = sortDir
      }

      const messages = await Message.find(q)
        .sort(sortq)
        .populate(['from', 'to'])
        // .select('_id age name email profile verified role')
        // .limit(limit * 1)
        // .skip((page - 1) * limit)
        .exec()

      const count = await Message.find(q).countDocuments()

      return res.status(200).json({
        messages,
        // totalPages: Math.ceil(count / limit),
        total: count,
        // currentPage: page,
        message: `Список всех сообщений`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// // Create claim
// router.post(
//   '/',
//   requireAuth,
//   roleAuthorization(['user', 'girl']),
//   async (req, res) => {
//     try {
//       const { type, title, description, targetId, details } = req.body
//       if (!title || !description) {
//         return res
//           .status('400')
//           .send({ error: { message: `Заполните заголовок и описание` } })
//       }
//       const userId = req.user._id
//       if (!req.user._id) {
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь не найден` } })
//       }
//       const user = await User.findById(req.user._id)
//       if (!user) {
//         console.log(`user not exist`)
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь не найден` } })
//       }

//       const target = await User.findById(targetId)
//       if (!target) {
//         console.log(`target not exist`)
//         return res
//           .status('400')
//           .send({ error: { message: `Субъект жалобы не найден` } })
//       }

//       if (type === 'payment' && details.paymentId) {
//         const checkPayment = await Payment.findById(details.paymentId)
//         if (!checkPayment) {
//           console.log(`payment not exist`)
//           return res
//             .status('400')
//             .send({ error: { message: `Платеж не найден` } })
//         }
//         if (checkPayment && checkPayment.claim) {
//           console.log(`payment already claimed`)
//           return res
//             .status('400')
//             .send({ error: { message: `Платеж уже обжалован или обжалуется` } })
//         }
//       }

//       const newClaim = new Claim({
//         status: 'new',
//         statusText: 'Жалоба создана',
//         type,
//         title,
//         description,
//         details,
//         user: userId,
//         target: targetId
//       })

//       await newClaim.save()

//       if (type === 'payment' && details.paymentId) {
//         // putting payment on hold
//         await Payment.findByIdAndUpdate(details.paymentId, {
//           $set: {
//             holded: true,
//             claim: newClaim._id
//           }
//         })
//       }

//       res.send({
//         newClaim,
//         message: 'Жалоба создана'
//       })
//     } catch (error) {
//       handleError(res, error)
//     }
//   }
// )

// // Mark claim as seen
// router.post(
//   '/seen/:id',
//   requireAuth,
//   roleAuthorization(['admin', 'moderator']),
//   async (req, res) => {
//     try {
//       const { id } = req.params
//       const userId = req.user._id
//       const claimCheck = await Claim.findOne({ _id: id, status: 'new' })
//       if (!claimCheck) {
//         return res
//           .status(400)
//           .json({ message: `Нельзя пометить данную жалобу` })
//       }

//       const claimUpdated = await Claim.findByIdAndUpdate(
//         id,
//         {
//           status: 'seen',
//           lastCheckedBy: userId
//         },
//         { new: true }
//       )
//         .populate(['user', 'lastCheckedBy', 'target'])
//         .exec()

//       return res
//         .status(200)
//         .json({ message: `Жалоба успешно помечена прочитанной`, claimUpdated })
//     } catch (e) {
//       return handleError(res, e)
//     }
//   }
// )

// // Mark claim as approved
// router.post(
//   '/approve/:id',
//   requireAuth,
//   roleAuthorization(['admin', 'moderator']),
//   async (req, res) => {
//     try {
//       const { id } = req.params
//       const userId = req.user._id
//       const { statusText } = req.body
//       if (!statusText) {
//         return res
//           .status(400)
//           .json({ message: `Необходимо ввести комментарий` })
//       }
//       const claimCheck = await Claim.findOne({
//         _id: id,
//         status: { $in: ['new', 'seen'] }
//       })
//       if (!claimCheck) {
//         return res
//           .status(400)
//           .json({ message: `Нельзя утвердить данную жалобу` })
//       }

//       const user = await User.findById(claimCheck.user)
//       if (!user) {
//         console.log(`user not exist`)
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь не найден` } })
//       }

//       if (claimCheck.type === 'payment') {
//         if (!claimCheck.details || !claimCheck.details.paymentId) {
//           return res
//             .status(400)
//             .json({ message: `Недостаточно данных в жалобе` })
//         }

//         // blocking payment to be payed to model
//         const updatedPayment = await Payment.findByIdAndUpdate(
//           claimCheck.details.paymentId,
//           {
//             $set: {
//               finished: true
//             }
//           },
//           { new: true }
//         )

//         // refunding user
//         const { amount } = updatedPayment
//         await User.findByIdAndUpdate(claimCheck.user, {
//           $set: {
//             balance: Math.floor(parseInt(user.balance) + parseInt(amount))
//           }
//         })
//       }

//       const claimUpdated = await Claim.findByIdAndUpdate(
//         id,
//         {
//           status: 'approved',
//           lastCheckedBy: userId,
//           statusText
//         },
//         { new: true }
//       )
//         .populate(['user', 'lastCheckedBy', 'target'])
//         .exec()

//       return res
//         .status(200)
//         .json({ message: `Жалоба успешно утверждена`, claimUpdated })
//     } catch (e) {
//       return handleError(res, e)
//     }
//   }
// )

// // Mark claim as rejected
// router.post(
//   '/reject/:id',
//   requireAuth,
//   roleAuthorization(['admin', 'moderator']),
//   async (req, res) => {
//     try {
//       const { id } = req.params
//       const userId = req.user._id
//       const { statusText } = req.body
//       if (!statusText) {
//         return res
//           .status(400)
//           .json({ message: `Необходимо ввести комментарий` })
//       }
//       const claimCheck = await Claim.findOne({
//         _id: id,
//         status: { $in: ['new', 'seen'] }
//       })
//       if (!claimCheck) {
//         return res
//           .status(400)
//           .json({ message: `Нельзя отклонить данную жалобу` })
//       }

//       const user = await User.findById(claimCheck.user)
//       if (!user) {
//         console.log(`user not exist`)
//         return res
//           .status('400')
//           .send({ error: { message: `Пользователь не найден` } })
//       }

//       if (claimCheck.type === 'payment') {
//         if (!claimCheck.details || !claimCheck.details.paymentId) {
//           return res
//             .status(400)
//             .json({ message: `Недостаточно данных в жалобе` })
//         }
//         await Payment.findByIdAndUpdate(claimCheck.details.paymentId, {
//           $set: {
//             holded: false
//           }
//         })
//       }

//       const claimUpdated = await Claim.findByIdAndUpdate(
//         id,
//         {
//           status: 'rejected',
//           lastCheckedBy: userId,
//           statusText
//         },
//         { new: true }
//       )
//         .populate(['user', 'lastCheckedBy', 'target'])
//         .exec()

//       return res.status(200).json({
//         message: `Жалоба успешно отклонена`,
//         claimUpdated
//       })
//     } catch (e) {
//       return handleError(res, e)
//     }
//   }
// )

module.exports = router
