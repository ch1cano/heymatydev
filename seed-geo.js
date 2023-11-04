require('dotenv-safe').config()
const initMongo = require('./config/mongo')
initMongo()
const Country = require('./app/models/country')
const City = require('./app/models/cities')
const collections = require('./data/2.geo/geo')

console.log(collections)
const seedData = async () => {
  for (const countryData of collections) {
    let country = await Country.findOne({ name: countryData.country })
    if (!country) {
      country = await Country.create({ name: countryData.country })
    }

    for (const cityName of countryData.cities) {
      let city = await City.findOne({ name: cityName })
      if (!city) {
        city = await City.create({ name: cityName, country: country._id })
      }

      // Add the city reference to the country if it's not there already
      if (!country.cities.includes(city._id)) {
        country.cities.push(city._id)
      }
    }

    // Save any changes to the country document
    await country.save()
  }

  console.log('Data seeded successfully!')
}

seedData()
