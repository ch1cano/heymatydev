/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const Comment = require('../models/comment')
const User = require('../models/user')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const { getItems } = require('../middleware/db/getItems')

// Get all comments for post
router.get(
  '/post/:postId',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const userId = req.user._id
      const { postId } = req.params
      if (!userId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }
      if (!postId) {
        return res
          .status('400')
          .send({ error: { message: `Пост указан неверно` } })
      }

      const q = {
        postId
      }
      const populate = ['userId']
      // const comments = await Comment.find(q)
      const comments = await getItems(req, Comment, q, populate)

      // const count = await Comment.find(q).countDocuments()

      return res.status(200).json({
        comments,
        // total: count,
        message: `Список комментариев к посту`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Get comments count for a post
router.get(
  '/count/post/:postId',
  // requireAuth,
  // roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { postId } = req.params
      if (!postId) {
        return res
          .status('400')
          .send({ error: { message: `Пост указан неверно` } })
      }

      const q = {
        postId
      }

      const count = await Comment.find(q).countDocuments()

      return res.status(200).json({
        count,
        message: `Количество комментариев к посту`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Create a comment for a post
router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { postId, comment, mentions } = req.body
      const userId = req.user._id
      if (!userId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }
      if (!postId) {
        return res
          .status('400')
          .send({ error: { message: `Неверно указан пост` } })
      }
      if (!comment) {
        return res
          .status('400')
          .send({ error: { message: `Комментарий не может быть пустым` } })
      }

      const newComment = new Comment({ userId, postId, comment })
      if (mentions && mentions.length) {
        const userQuery = {
          $or: []
        }
        // console.log(mentions)
        mentions.forEach((mention) => {
          userQuery.$or.push(
            {
              profileNum: {
                $eq: Number.parseInt(mention) || 0
              }
            },
            {
              profileUrl: {
                $eq: mention
              }
            }
          )
        })
        const mentionedUsers = await getItems(req, User, userQuery)
        newComment.mentions = mentionedUsers.docs.map((mu) => mu._id)
      }
      await newComment.populate('userId').execPopulate()
      await newComment.save()
      return res.status(200).json({
        newComment,
        message: `Комментарий успешно создан`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Delete a comment for a post
router.delete(
  '/:commentId',
  requireAuth,
  roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { commentId } = req.params
      const userId = req.user._id
      if (!userId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }
      if (!commentId) {
        return res
          .status('400')
          .send({ error: { message: `Неверно указан комментарий` } })
      }

      const checkComment = await Comment.findOne({ userId, _id: commentId })
      if (!checkComment) {
        return res
          .status('400')
          .send({ error: { message: `Нельзя удалить этот комментарий` } })
      }

      await checkComment.delete()
      return res.status(200).json({
        message: `Комментарий успешно удален`
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
