require('dotenv-safe').config()
const initMongo = require('./config/mongo')
const Language = require('./app/models/language')
const collections = require('./data/4.languages/language')
initMongo()
console.log(collections)

const main = async () => {
  try {
    await Language.deleteMany()
    await Language.insertMany(collections)
    console.log('Seed complete!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

main()
