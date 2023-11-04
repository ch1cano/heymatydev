const faker = require('faker')

const json = [
  {
    name: 'Chat',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Video Call',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Videos',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Images',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
