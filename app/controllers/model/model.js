/* eslint-disable max-statements */
const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')
const Service = require('../../models/services')
const Language = require('../../models/language')
const User = require('../../models/user')
const Notification = require('../../models/notifications')
const VerifiedModel = require('../../../emails/verifiedModel')
const Verified = require('../../../emails/verified')
const MessageModel = require('../../../emails/messageModel')
const moment = require('moment')

exports.modelByAge = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { age } = req.body
    const { page, limit } = req.query

    const models = await User.find({ age, role: 'girl' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({ age, role: 'girl' }).countDocuments()

    return res.status(200).json({
      models,
      message: `Девушки с возрастом: ${age}`,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAges = async (req, res) => {
  try {
    const ages = await Ages.find({}, { value: 1, _id: 1 }) // это вернет все записи, но только с полем age
    res.json(ages)
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModels = async (req, res) => {
  try {
    // Получаем параметр data из query
    const data = JSON.parse(req.query.data)
    const { name, ages, languages, cities, country } = data
    const { page, sort } = req.query
    const limit = 10
    const q = {
      role: 'girl',
      verified: true,
      $or: [
        { blockExpires: { $lte: new Date() } },
        { blockExpires: { $exists: false } }
      ]
    }

    if (name) {
      q.name = {
        $regex: '^' + name,
        $options: 'i'
      }
    }
    if (ages && ages.length > 0) {
      q.age = { $in: ages.map((age) => age) }
    }
    if (languages && languages.length > 0) {
      q.languages = { $in: cities.map((lang) => lang) }
    }
    if (cities && cities.length > 0) {
      q.city = { $in: cities.map((city) => city) }
    }
    if (country) {
      q.country = country
    }

    let sortq = {
      createdAt: -1,
      name: 1
    }

    if (sort) {
      sortq = {}
      const sortKey = sort.replace(/[\+-]/g, '')
      const sortDir = parseInt(`${sort[0]}1`)
      sortq[sortKey] = sortDir
    }

    const models = await User.find(q)
      .sort(sortq)
      .select(
        '_id age name email profileNum profileUrl profile verified nationalId country city services languages blockExpires personalDayOfBirth personalMonthOfBirth personalYearOfBirth personalCountry personalCity'
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find(q).countDocuments()

    models.map((model) => {
      if (!model.profileUrl) {
        model.profileUrl = model.profileNum
      }
      if (model.profile) {
        model.profile.path = `${'https:' + '//'}${req.get('host')}//${model.profile.path
          }`
      }
      if (model.nationalId) {
        model.nationalId.path = `${'https:' + '//'}${req.get('host')}//${model.nationalId.path
          }`
      }
    })

    return res.status(200).json({
      models,
      totalPages: Math.ceil(count / limit),
      total: count,
      currentPage: parseInt(page),
      message: `Список всех девушек`
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModelsAdmin = async (req, res) => {
  try {
    const { page, limit, verified, email, sort, noBlocked } = req.query

    const q = {
      role: 'girl'
    }

    if (verified) {
      q.verified = verified
    }
    if (noBlocked) {
      q.$or = [
        { blockExpires: { $lte: new Date() } },
        { blockExpires: { $exists: false } }
      ]
    }
    if (email) {
      q.email = {
        $regex: email
      }
    }

    let sortq = {
      createdAt: -1
    }

    if (sort) {
      sortq = {}
      const sortKey = sort.replace(/[\+-]/g, '')
      const sortDir = parseInt(`${sort[0]}1`)
      sortq[sortKey] = sortDir
    }

    const models = await User.find(q)
      .sort(sortq)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find(q).countDocuments()

    models.map((model) => {
      if (!model.profileUrl) {
        model.profileUrl = model.profileNum
      }
      if (model.profile) {
        model.profile.path = `${'https:' + '//'}${req.get('host')}//${model.profile.path
          }`
      }
      if (model.nationalId) {
        model.nationalId.path = `${'https:' + '//'}${req.get('host')}//${model.nationalId.path
          }`
      }
      if (model.personalPassport) {
        model.personalPassport.path = `${'https:' + '//'}${req.get('host')}//${model.personalPassport.path
          }`
      }
      if (model.personalIDCardFront) {
        model.personalIDCardFront.path = `${'https:' + '//'}${req.get(
          'host'
        )}//${model.personalIDCardFront.path}`
      }
      if (model.personalIDCardBack) {
        model.personalIDCardBack.path = `${'https:' + '//'}${req.get(
          'host'
        )}//${model.personalIDCardBack.path}`
      }
      if (model.personalDriverLicenseFront) {
        model.personalDriverLicenseFront.path = `${'https:' + '//'}${req.get(
          'host'
        )}//${model.personalDriverLicenseFront.path}`
      }
      if (model.personalDriverLicenseBack) {
        model.personalDriverLicenseBack.path = `${'https:' + '//'}${req.get(
          'host'
        )}//${model.personalDriverLicenseBack.path}`
      }
      if (model.personalSelfie) {
        model.personalSelfie.path = `${'https:' + '//'}${req.get('host')}//${model.personalSelfie.path
          }`
      }
    })

    return res.status(200).json({
      models,
      totalPages: Math.ceil(count / limit),
      total: count,
      currentPage: page,
      message: `Список всех девушек со всеми данными`
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.verifiedModel = async (req, res) => {
  try {
    const { id } = req.params
    let modelCheck = await User.findOne({ _id: id, role: 'girl' })
    if (!modelCheck) {
      return res.status(400).json({ message: `Нет девушки с заданным id` })
    }

    modelCheck = await User.findOne({ _id: id, role: 'girl', verified: true })
    if (modelCheck) {
      return res.status(400).json({ message: `Девушка уже верифицирована` })
    }

    const modelUpdated = await User.findByIdAndUpdate(
      id,
      {
        verified: true
      },
      { new: true }
    )

    const notification = new Notification({
      user: modelUpdated._id,
      message: 'Поздравляем, ваш аккаунт прошел верификацию'
    })

    await notification.save()

    await Verified(modelUpdated)

    return res
      .status(200)
      .json({ message: `Девушка успешно верифицирована`, modelUpdated })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.unverifiedModel = async (req, res) => {
  try {
    const { id } = req.params
    let modelCheck = await User.findOne({ _id: id, role: 'girl' })
    if (!modelCheck) {
      return res.status(400).json({ message: `Нет девушки с заданным id` })
    }

    modelCheck = await User.findOne({ _id: id, role: 'girl', verified: false })
    if (modelCheck) {
      return res
        .status(400)
        .json({ message: `У девушки уже убрана верификация` })
    }

    const modelUpdated = await User.findByIdAndUpdate(
      id,
      {
        verified: false
      },
      { new: true }
    )

    const notification = new Notification({
      user: modelUpdated._id,
      message: 'У Вашего аккаунт была убрана верификация'
    })

    await notification.save()

    return res
      .status(200)
      .json({ message: `У девушки успешно убрана верификация`, modelUpdated })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.blockModel = async (req, res) => {
  try {
    const { id } = req.params
    let modelCheck = await User.findOne({ _id: id, role: 'girl' })
    if (!modelCheck || modelCheck.blockExpires > new Date()) {
      return res.status(400).json({
        message: `Нет девушки с заданным id либо девушка уже заблокирована`
      })
    }

    const modelUpdated = await User.findByIdAndUpdate(
      id,
      {
        blockExpires: moment().add(365, 'days').toDate()
      },
      { new: true }
    )

    const notification = new Notification({
      user: modelUpdated._id,
      message: 'Ваш аккаунт был заблокирован Администрацией Heydaddy'
    })

    await notification.save()

    return res
      .status(200)
      .json({ message: `Девушка успешно заблокирована`, modelUpdated })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.unblockModel = async (req, res) => {
  try {
    const { id } = req.params
    let modelCheck = await User.findOne({ _id: id, role: 'girl' })
    if (!modelCheck || modelCheck.blockExpires <= new Date()) {
      return res.status(400).json({
        message: `Нет девушки с заданным id либо девушка уже разблокирована`
      })
    }

    const modelUpdated = await User.findByIdAndUpdate(
      id,
      {
        blockExpires: moment().subtract(1, 'days').toDate()
      },
      { new: true }
    )

    const notification = new Notification({
      user: modelUpdated._id,
      message: 'Ваш аккаунт был разблокирован Администрацией Heydaddy'
    })

    await notification.save()

    return res
      .status(200)
      .json({ message: `Девушка успешно разблокирована`, modelUpdated })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.GetByPrice = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { price } = req.body
    const { page, limit } = req.query

    const models = await User.find({ pricePerDay: price, role: 'girl' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({
      pricePerDay: price,
      role: 'girl'
    }).countDocuments()

    return res.status(200).json({
      models,
      message: `Все девушки с ценой ${price} USD в день.`,
      length: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModelWithService = async (req, res) => {
  try {
    const { id } = req.params

    const serviceCheck = await Service.findById(id)

    if (!serviceCheck) {
      return res.status(400).json({ message: 'Услуга не найдена' })
    }
    const { page, limit } = req.query

    const models = await User.find({ services: id, role: 'girl' })
      .populate('services')
      .populate('languages')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({
      services: id,
      role: 'girl'
    }).countDocuments()

    return res.status(200).json({
      models,
      message: `Все девушки с услугой ${serviceCheck.name}`,
      length: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModelWithLanguage = async (req, res) => {
  try {
    const { id } = req.params

    const languageCheck = await Language.findById(id)

    if (!languageCheck) {
      return res.status(400).json({ message: 'Языка нет в списке' })
    }
    const { page, limit } = req.query

    const models = await User.find({ languages: id, role: 'girl' })
      .populate('languages')
      .populate('services')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({
      languages: id,
      role: 'girl'
    }).countDocuments()

    return res.status(200).json({
      models,
      message: `Все девушки с языком: ${languageCheck.name}`,
      length: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModelWithCountry = async (req, res) => {
  try {
    const { data: rawData, page } = req.query
    const parsedData = JSON.parse(rawData || '{}')
    const { countryId } = parsedData

    const limit = 10

    const models = await User.find({
      country: countryId,
      role: 'girl'
    })
      .populate('languages')
      .populate('services')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({
      country: countryId,
      role: 'girl'
    }).countDocuments()

    return res.status(200).json({
      models,
      message: `Все девушки по стране: ${countryId}`,
      length: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getAllModelWithCity = async (req, res) => {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json(errors)
    // }
    const { data: rawData, page } = req.query
    const parsedData = JSON.parse(rawData || '{}')
    const { cityId } = parsedData
    const limit = 10


    const models = await User.find({
      city: cityId,
      role: 'girl'
    })
      .populate('languages')
      .populate('services')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await User.find({
      city: cityId,
      role: 'girl'
    }).countDocuments()

    return res.status(200).json({
      models,
      message: `Все девушки по городу: ${cityId}`,
      length: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.createModel = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name, email, age, pricePerDay, password, country, state, city } =
      req.body
    const { file } = req
    const userCheck = await User.findOne({ email })
    if (userCheck) {
      return res
        .status(400)
        .json({ message: 'Email уже используется другим пользователем' })
    }
    let model = ''
    if (file) {
      model = new User({
        name,
        email,
        age,
        pricePerDay,
        profile: file,
        role: 'girl',
        password,
        country,
        state,
        city
      })
      await model.save()
      const notification = new Notification({
        user: model._id,
        message:
          'Ожидайте подтверждения вашего аккаунта Администрацией Heydaddy'
      })
      await notification.save()
    } else {
      model = new User({
        name,
        email,
        age,
        pricePerDay,
        role: 'girl',
        password,
        country,
        state,
        city
      })
      await model.save()
      const notification = new Notification({
        user: model._id,
        message:
          'Загрузите фото вашего паспорта для верификации вашего аккаунта'
      })
      await notification.save()

      await VerifiedModel(model)
      // await MessageModel(model, model)
    }

    return res
      .status(200)
      .json({ message: 'Девушка успешно зарегистрирована', model })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.updateModel = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name, email, age, country, city, services, languages, verified } =
      req.body
    const userCheck = await User.findOne({ email })
    if (!userCheck) {
      return res.status(400).json({ message: 'Email не существует' })
    }
    const model = await User.findByIdAndUpdate(
      userCheck._id,
      {
        $set: {
          name,
          age,
          country,
          city,
          services,
          languages,
          verified
        }
      },
      { new: true }
    )

    await VerifiedModel(model)

    return res.status(200).json({ message: 'Модель успешно обновлена', model })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.uploadIdCard = async (req, res) => {
  try {
    const { file } = req

    const modelCheck = await User.findById(req.user._id)
    if (modelCheck.role != 'girl' || !modelCheck) {
      return res.status(200).json({ message: 'Войдите к себе в аккаунт' })
    }

    const modelUpdate = await User.findByIdAndUpdate(
      req.user._id,
      {
        nationalId: file
      },
      { new: true }
    )
    return res.status(200).json({
      message:
        'Спасибо! Ожидайте проверки вашего профиля Администрацией Heydaddy',
      modelUpdate
    })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.createGirl = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors[0].msg })
    }
    let { name, email, age, pricePerDay, password, country, state, city } =
      req.body
    country = JSON.parse(country)
    state = JSON.parse(state)
    city = JSON.parse(city)
    const { file } = req
    const userCheck = await User.findOne({ email })
    if (userCheck) {
      return res
        .status(400)
        .json({ message: 'Email уже используется другим пользователем' })
    }
    let model = ''
    if (file) {
      model = new User({
        name,
        email,
        age,
        pricePerDay,
        profile: file,
        role: 'girl',
        password,
        country,
        state,
        city,
        verified: true
      })
      await model.save()
      const notification = new Notification({
        user: model._id,
        message:
          'Ожидайте подтверждения вашего аккаунта Администрацией Heydaddy'
      })
      await notification.save()
    } else {
      model = new User({
        name,
        email,
        age,
        pricePerDay,
        role: 'girl',
        password,
        country,
        state,
        city,
        verified: true
      })
      await model.save()
      const notification = new Notification({
        user: model._id,
        message: 'You are registered as girl.'
      })
      await notification.save()

      // await VerifiedModel(model);
      // await MessageModel(model, model)
    }

    return res
      .status(200)
      .json({ message: 'Girl registered successfully!', model })
  } catch (e) {
    return handleError(res, e)
  }
}
