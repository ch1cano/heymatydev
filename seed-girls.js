const mongoose = require('mongoose')
require('dotenv-safe').config()
const initMongo = require('./config/mongo')
initMongo()
const User = require('./app/models/user')
const Country = require('./app/models/country')
const Language = require('./app/models/language')

// eslint-disable-next-line max-statements
const updateUsersWithSpecificIds = async () => {
  const countries = await Country.find({}).populate('cities')
  const languagesRaw = await Language.find({})
  const languages = languagesRaw.map((lang) =>
    mongoose.Types.ObjectId(lang._id)
  ) // Извлекаем и преобразуем только _id

  const getRandomFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const users = await User.find({})

  for (const user of users) {
    const randomCountry = getRandomFromArray(countries)
    user.country = mongoose.Types.ObjectId(randomCountry._id)
    user.personalCountry = randomCountry.name

    if (randomCountry.cities && randomCountry.cities.length) {
      const randomCity = getRandomFromArray(randomCountry.cities)
      user.city = mongoose.Types.ObjectId(randomCity._id)
      user.personalCity = randomCity.name
    }

    // Добавляем от 1 до 3 языков пользователю
    const numLanguages = Math.floor(Math.random() * 3) + 1
    user.languages = []

    for (let i = 0; i < numLanguages; i++) {
      const languageId = getRandomFromArray(languages)
      if (!user.languages.includes(languageId)) {
        user.languages.push(mongoose.Types.ObjectId(languageId))
      }
    }

    await user.save()
  }

  console.log('Users updated!')
}

updateUsersWithSpecificIds()
