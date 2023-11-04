const { handleError } = require('../../middleware/utils')
const { validationResult } = require('express-validator')
const Service = require('../../models/services')

exports.getServices = async (req, res) => {
  try {
    const { page, limit, q } = req.query

    if (q == '' || !q) {
      const services = await Service.find()
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Service.find().countDocuments()

      return res.status(200).json({
        services,
        message: 'All services!',
        length: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } else {
      const services = await Service.find({
        name: { $regex: q, $options: 'i' }
      })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await Service.find({
        name: { $regex: q, $options: 'i' }
      }).countDocuments()

      return res.status(200).json({
        services,
        message: 'All services!',
        length: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    }
  } catch (e) {
    return handleError(res, e)
  }
}

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return res
        .status(400)
        .json({ message: 'Service is not exist in Service List' })
    }

    await service.remove()

    return res
      .status(200)
      .json({ message: 'Service deleted Successfully from Services List!' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return res
        .status(400)
        .json({ message: 'No service exist against this id' })
    }

    return res.status(200).json({ message: 'Service is', service })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.CreateService = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name } = req.body

    const serviceCheck = await Service.findOne({ name })
    if (serviceCheck) {
      return res.status(400).json({ message: 'Service name already exist' })
    }
    const service = new Service({ name })
    await service.save()
    return res.status(200).json({ message: 'Service Saved SuccessFully!' })
  } catch (e) {
    return handleError(res, e)
  }
}

exports.updateService = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { name, id } = req.body

    const service = await Service.findByIdAndUpdate(
      id,
      {
        name
      },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Service Updated Successfully!', service })
  } catch (e) {
    return handleError(res, e)
  }
}
