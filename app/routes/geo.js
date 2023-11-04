const jsonDoc = require('../constants/geo.json')
const express = require('express')
const router = express.Router()

/*
 * Get countries
 */
router.get('/', function (req, res) {
  try {
    res.json({
      message: 'Страны отдал',
      jsonDoc: JSON.stringify(jsonDoc)
    })
  } catch (error) {
    console.trace(error)
    res.sendStatus(500)
  }
})

/*
 * Get cities by country name
 */
router.get('/:country', function (req, res) {
  try {
    const cities = jsonDoc[req.params.country]
    if (!cities) {
      throw new Error('No cities found for ' + req.params.country)
    }
    res.json({
      message: `Города для страны ${req.params.country} отдал`,
      jsonDoc: JSON.stringify(cities)
    })
  } catch (error) {
    console.trace(error)
    res.sendStatus(500)
  }
})

module.exports = router
