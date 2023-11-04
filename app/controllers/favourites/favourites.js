const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')
const Favourite = require('../../models/favourite')

exports.getFavourite = async (req, res) => {
  try {
    const model = await Favourite.findById(req.params.id).populate('modelId')

    if (!model) {
      return res.status(400).json({ message: 'Девушки нет в Избранном' })
    }

    return res
      .status(200)
      .json({ favourite: model, message: 'Девушка получена' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.GetMineFavourites = async (req, res) => {
  try {
    const models = await Favourite.find({ userId: req.user._id }).populate(
      'modelId'
    )

    return res
      .status(200)
      .json({ favouriteModels: models, message: 'Все девушки в Избранном' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.GetFavouritesCount = async (req, res) => {
  try {
    const { modelId } = req.params
    const count = await Favourite.find({ modelId }).countDocuments()

    return res
      .status(200)
      .json({ count, message: 'Количество добавлений девушки в Избранное' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.createFavourite = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { modelId } = req.body
    const favouriteCheck = await Favourite.findOne({
      userId: req.user._id,
      modelId
    })
    if (favouriteCheck) {
      return res.status(400).json({
        favourite: favouriteCheck,
        message: 'Девушка уже в Избранном'
      })
    }
    const favourite = new Favourite({
      userId: req.user._id,
      modelId
    })
    await favourite.save()
    return res
      .status(200)
      .json({ favourite, message: 'Девушка добавлена в Избранное' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.delFavourite = async (req, res) => {
  try {
    const model = await Favourite.findById(req.params.id)

    if (!model) {
      return res.status(400).json({ message: 'Девушки нет в Избранном' })
    }

    await model.remove()

    return res.status(200).json({ message: 'Девушка удалена из Избранного' })
  } catch (e) {
    return handleError(res, e)
  }
}
