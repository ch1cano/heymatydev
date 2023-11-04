const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')
const Language = require('../../models/language')

exports.getLanguages = async (req, res) => {
  try {
    const { page, limit, q } = req.query

    if (q == '' || !q) {
      const languages = await Language.find()
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Language.find().countDocuments()

      return res.status(200).json({
        languages,
        message: 'Все языки',
        length: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } else {
      const languages = await Language.find({
        name: { $regex: q, $options: 'i' }
      })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Language.find({
        name: { $regex: q, $options: 'i' }
      }).countDocuments()

      return res.status(200).json({
        data: languages,
        message: 'Все языки',
        length: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    }
  } catch (e) {
    return handleError(res, e)
  }
}

exports.deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id)

    if (!language) {
      return res
        .status(400)
        .json({ message: 'Такой язык уже есть в списке языков' })
    }

    await language.remove()

    return res.status(200).json({ message: 'Язык удален из списка языков' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id)

    if (!language) {
      return res
        .status(400)
        .json({ message: 'Такой язык уже есть в списке языков' })
    }

    return res.status(200).json({ message: 'Language is', language })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.CreateLanguage = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name } = req.body

    const languageCheck = await Language.findOne({ name })
    if (languageCheck) {
      return res.status(400).json({ message: 'Такой язык уже есть' })
    }
    const language = new Language({ name })
    await language.save()
    return res
      .status(200)
      .json({ message: 'Язык успешно добавлен в список языков', language })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.updateLanguage = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name, id } = req.body

    const language = await Language.findByIdAndUpdate(
      id,
      {
        name
      },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Язык успешно добавлен в список языков', language })
  } catch (e) {
    return handleError(res, e)
  }
}
