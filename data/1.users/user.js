const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

let num = 1

module.exports = [
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    name: 'Super Administrator',
    email: 'admin@admin.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    profileNum: num++,
    profileUrl: 'a',
    role: 'admin',
    verified: true,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148f',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: '123123',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995b'),
    name: 'Simple user',
    email: 'user@user.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    profileNum: num++,
    verified: true,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148d',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: '123123',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('60ef05ba21bc993ba889923e'),
    role: 'user',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: true,
    balance: 100000,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'user1',
    email: 'user1@test.ru',
    password: '$2b$05$12.SR2aA3y0jMnV9lrjjxOuNM0YYJ19iiDJpcVgmWnrswkoTbcGv6',
    verification: '1e6c6cb8-ebfa-4865-888b-944108cb9900',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'admin',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: true,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'admin1',
    email: 'admin1@test.ru',
    password: '$2b$05$12.SR2aA3y0jMnV9lrjjxOuNM0YYJ19iiDJpcVgmWnrswkoTbcGv6',
    verification: '1e6c6cb8-ebfa-4865-888b-944108cb9900',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'moderator',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: true,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'mod1',
    email: 'mod1@test.ru',
    password: '$2b$05$12.SR2aA3y0jMnV9lrjjxOuNM0YYJ19iiDJpcVgmWnrswkoTbcGv6',
    verification: '1e6c6cb8-ebfa-4865-888b-944108cb9900',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('60ef05df21bc993ba8899240'),
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: true,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl1',
    email: 'girl1@test.ru',
    password: '$2b$05$7.xuWf4ypSQjbCRBlXwInuSbnJOGjsOyGqVV.W1UQsG6L1sNgChry',
    verification: 'b3a7ed68-a1af-4068-83c8-955f5e1d4d6f',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('60ef060b21bc993ba8899243'),
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: true,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl2',
    email: 'girl2@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl3',
    email: 'girl3@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl4',
    email: 'girl4@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl5',
    email: 'girl5@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl6',
    email: 'girl6@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl7',
    email: 'girl7@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl8',
    email: 'girl8@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl9',
    email: 'girl9@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl10',
    email: 'girl10@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl11',
    email: 'girl11@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    role: 'girl',
    profileNum: num++,
    subscribers: [],
    subscribed: [],
    profileGallery: [],
    verified: false,
    balance: 0,
    age: 18,
    pricePerDay: 1,
    services: [],
    languages: [],
    loginAttempts: 0,
    name: 'girl12',
    email: 'girl12@test.ru',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'dcfbda36-9193-49aa-a8d4-ae7dcd747a91',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    profileNum: num++,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    emailConfirmed: false,
    role: 'girl',
    subscribers: [],
    subscribed: [],
    subscriptionEnabled: false,
    profileUrl: '',
    profileGallery: [],
    verified: true,
    balance: 0,
    unconfirmedBalance: 0,
    age: 18,
    pricePerDay: 1,
    pricePerMessage: 9999,
    services: [],
    languages: [],
    loginAttempts: 0,
    personalIDHasNoExpiration: false,
    name: 'lalala',
    email: 'lala@lala.la',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'e68ee9ea-b479-4bef-866c-fc543204da77',
    emailConfirmationCode: '3fc3edf2-5fce-44f0-867d-00aed297df63',
    emailConfirmationValidUntil: faker.date.recent(),
    emailConfirmationRequestedAt: faker.date.past(),
    blockExpires: faker.date.past(),
    messageBundles: [],
    personalBuilding: '232',
    personalCity: 'Ura Vajgurore',
    personalCountry: 'Albania',
    personalDayOfBirth: 2,
    personalFamilyName: 'lalalal',
    personalFirstName: 'lala',
    personalMonthOfBirth: 1,
    personalSex: 'female',
    personalStreet: 'asdasd',
    personalYearOfBirth: 2000,
    personalZIP: '12312323',
    personalIDExpirationDay: 30,
    personalIDExpirationMonth: 3,
    personalIDExpirationYear: 2022,
    personalPassport: [
      {
        fieldname: 'personalPassport',
        originalname: 'photo_2021-08-24_08-23-29.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561071-photo_2021-08-24_08-23-29.jpg',
        path: 'public\\media\\1650430561071-photo_2021-08-24_08-23-29.jpg',
        size: 47262
      }
    ],
    personalSelfie: [
      {
        fieldname: 'personalSelfie',
        originalname: 'm1.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561076-m1.jpeg',
        path: 'public\\media\\1650430561076-m1.jpeg',
        size: 46736
      }
    ]
  },
  {
    profileNum: num++,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    emailConfirmed: false,
    role: 'girl',
    subscribers: [],
    subscribed: [],
    subscriptionEnabled: false,
    profileUrl: '',
    profileGallery: [],
    verified: true,
    balance: 0,
    unconfirmedBalance: 0,
    age: 18,
    pricePerDay: 1,
    pricePerMessage: 9999,
    services: [],
    languages: [],
    loginAttempts: 0,
    personalIDHasNoExpiration: false,
    name: 'lololo',
    email: 'lolo@lolo.la',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'e68ee9ea-b479-4bef-866c-fc543204da77',
    emailConfirmationCode: '3fc3edf2-5fce-44f0-867d-00aed297df63',
    emailConfirmationValidUntil: faker.date.recent(),
    emailConfirmationRequestedAt: faker.date.past(),
    blockExpires: faker.date.past(),
    messageBundles: [],
    personalBuilding: '232',
    personalCity: 'Elbasan',
    personalCountry: 'Albania',
    personalDayOfBirth: 2,
    personalFamilyName: 'lalalal',
    personalFirstName: 'lala',
    personalMonthOfBirth: 1,
    personalSex: 'female',
    personalStreet: 'asdasd',
    personalYearOfBirth: 1997,
    personalZIP: '12312323',
    personalIDExpirationDay: 30,
    personalIDExpirationMonth: 3,
    personalIDExpirationYear: 2022,
    personalPassport: [
      {
        fieldname: 'personalPassport',
        originalname: 'photo_2021-08-24_08-23-29.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561071-photo_2021-08-24_08-23-29.jpg',
        path: 'public\\media\\1650430561071-photo_2021-08-24_08-23-29.jpg',
        size: 47262
      }
    ],
    personalSelfie: [
      {
        fieldname: 'personalSelfie',
        originalname: 'm1.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561076-m1.jpeg',
        path: 'public\\media\\1650430561076-m1.jpeg',
        size: 46736
      }
    ]
  },
  {
    profileNum: num++,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    emailConfirmed: false,
    role: 'girl',
    subscribers: [],
    subscribed: [],
    subscriptionEnabled: false,
    profileUrl: '',
    profileGallery: [],
    verified: true,
    balance: 0,
    unconfirmedBalance: 0,
    age: 18,
    pricePerDay: 1,
    pricePerMessage: 9999,
    services: [],
    languages: [],
    loginAttempts: 0,
    personalIDHasNoExpiration: false,
    name: 'lululu',
    email: 'lulu@lulu.la',
    password: '$2b$05$26VqhCgnv22dMk.QFDGZeO9vSxPBsl2NSgJ7JwS9XfPqCT4NqEI4y',
    verification: 'e68ee9ea-b479-4bef-866c-fc543204da77',
    emailConfirmationCode: '3fc3edf2-5fce-44f0-867d-00aed297df63',
    emailConfirmationValidUntil: faker.date.recent(),
    emailConfirmationRequestedAt: faker.date.past(),
    blockExpires: faker.date.past(),
    messageBundles: [],
    personalBuilding: '232',
    personalCity: 'Abasto',
    personalCountry: 'Argentina',
    personalDayOfBirth: 2,
    personalFamilyName: 'lalalal',
    personalFirstName: 'lala',
    personalMonthOfBirth: 1,
    personalSex: 'female',
    personalStreet: 'asdasd',
    personalYearOfBirth: 1990,
    personalZIP: '12312323',
    personalIDExpirationDay: 30,
    personalIDExpirationMonth: 3,
    personalIDExpirationYear: 2022,
    personalPassport: [
      {
        fieldname: 'personalPassport',
        originalname: 'photo_2021-08-24_08-23-29.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561071-photo_2021-08-24_08-23-29.jpg',
        path: 'public\\media\\1650430561071-photo_2021-08-24_08-23-29.jpg',
        size: 47262
      }
    ],
    personalSelfie: [
      {
        fieldname: 'personalSelfie',
        originalname: 'm1.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './public/media',
        filename: '1650430561076-m1.jpeg',
        path: 'public\\media\\1650430561076-m1.jpeg',
        size: 46736
      }
    ]
  }
]