const { Headers } = require('cross-fetch')
const fetch = require('node-fetch')
const Country = require('../../models/country') // Replace 'path-to-country-model' with the actual path to your Country model file
const City = require('../../models/cities') // Replace 'path-to-city-model' with the actual path to your City model file

exports.allCountries = async (req, res) => {
  try {
    const countries = await Country.find()
      .populate('cities', '_id name') // Populate the 'cities' field from the 'City' model, only retrieving the city _id and name
      .exec()

    return res.status(200).json({ data: countries });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

exports.cities = async (req, res) => {
  try {
    const cities = await City.find({}, { name: 1, _id: 1 })
    return res.status(200).json({ data: cities })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

exports.countryStates = async (req, res) => {
  try {
    const { countryISO } = req.params
    const headers = new Headers()
    headers.append(
      'X-CSCAPI-KEY',
      'NjlxQm04MkJYc2xWd1ZHcGFodzJXSzJuQmxVNFNwbnh3aWVXeWtucw=='
    )

    const requestOptions = {
      method: 'GET',
      headers,
      redirect: 'follow'
    }

    fetch(
      `https://api.countrystatecity.in/v1/countries/${countryISO}/states`,
      requestOptions
    )
      .then((response) => response.text())
      .then((states) => {
        return res.status(200).json({ states: JSON.parse(states) })
      })
      .catch((error) => {
        return res.status(400).json({ message: error.message })
      })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}


