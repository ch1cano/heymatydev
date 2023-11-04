/* eslint-disable max-statements */
const express = require('express')
const router = express.Router()
const { handleError } = require('../middleware/utils')
const Bundle = require('../models/bundle')
const { roleAuthorization } = require('../controllers/auth')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

// Get all my bundles
router.get('/', requireAuth, roleAuthorization(['girl']), async (req, res) => {
  try {
    const userId = req.user._id
    if (!userId) {
      return res
        .status('400')
        .send({ error: { message: `Пользователь указан неверно` } })
    }

    const q = {
      user: userId
    }

    const bundles = await Bundle.find(q)

    const count = bundles.length

    return res.status(200).json({
      bundles,
      total: count,
      message: `Список всех пакетов`
    })
  } catch (error) {
    handleError(res, error)
  }
})

// Get a bundle
router.get(
  '/:bundleId',
  requireAuth,
  roleAuthorization(['girl']),
  async (req, res) => {
    try {
      const userId = req.user._id
      const { bundleId } = req.params
      if (!userId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }

      const q = {
        user: userId,
        _id: bundleId
      }

      const bundle = await Bundle.findOne(q)

      if (!bundle) {
        return res
          .status('400')
          .send({ error: { message: `Невозможно найти пакет` } })
      }

      return res.status(200).json({
        bundle,
        message: `Пакет`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Create a bundle
router.post('/', requireAuth, roleAuthorization(['girl']), async (req, res) => {
  try {
    const { qty, price, isActive, description, type, amount } = req.body
    const userId = req.user._id
    if (!userId) {
      return res
        .status('400')
        .send({ error: { message: `Пользователь указан неверно` } })
    }
    if (!qty) {
      return res
        .status('400')
        .send({ error: { message: `Неверно указано количество сообщений` } })
    }
    if (!price) {
      return res
        .status('400')
        .send({ error: { message: `Неверно указана цена` } })
    }
    if (type === 'limited' && !amount) {
      return res.status('400').send({
        error: {
          message: `Неверно указано количество пакетов для лимитированного пакета`
        }
      })
    }

    const newBundle = new Bundle({
      user: userId,
      qty,
      price,
      isActive,
      description,
      type,
      amount
    })
    await newBundle.save()
    return res.status(200).json({
      newBundle,
      message: `Пакет успешно создан`
    })
  } catch (error) {
    handleError(res, error)
  }
})

// Delete a bundle
router.delete(
  '/:bundleId',
  requireAuth,
  roleAuthorization(['girl']),
  async (req, res) => {
    try {
      const { bundleId } = req.params
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

      const checkBundle = await Bundle.findOne({ user: userId, _id: bundleId })
      if (!checkBundle) {
        return res
          .status('400')
          .send({ error: { message: `Нельзя удалить этот пакет` } })
      }

      await checkBundle.delete()
      return res.status(200).json({
        message: `Пакет успешно удален`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

// Get all active bundles of model
router.get(
  '/model/:modelId',
  // requireAuth,
  // roleAuthorization(['user', 'girl']),
  async (req, res) => {
    try {
      const { modelId } = req.params
      if (!modelId) {
        return res
          .status('400')
          .send({ error: { message: `Пользователь указан неверно` } })
      }

      const q = {
        user: modelId,
        isActive: true
      }

      const bundles = await Bundle.find(q)

      const count = bundles.length

      return res.status(200).json({
        bundles,
        total: count,
        message: `Список всех пакетов модели`
      })
    } catch (error) {
      handleError(res, error)
    }
  }
)

module.exports = router
