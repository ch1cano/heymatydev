const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

let numCounter = 1

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    emailConfirmationCode: {
      type: String
    },
    emailConfirmationValidUntil: {
      type: Date
    },
    emailConfirmationRequestedAt: {
      type: Date
    },
    password: {
      type: String,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'girl', 'admin', 'moderator'],
      default: 'user'
    },
    verification: {
      type: String
    },
    description: {
      type: String
    },
    subscribers: {
      type: Array
    },
    subscribed: {
      type: Array
    },
    subscriptionEnabled: {
      type: Boolean,
      default: false
    },
    profileNum: {
      type: Number,
      default: () => numCounter++
    },
    profileUrl: {
      type: String,
      default: ''
    },
    profileGallery: {
      type: Array
    },
    verified: {
      type: Boolean,
      default: false
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    unconfirmedBalance: {
      type: Number,
      default: 0,
      min: 0
    },
    inBTCAddress: {
      type: String
    },
    outBTCAddress: {
      type: String
    },
    paymentCode: {
      type: String
    },
    invoice: {
      type: String
    },
    age: {
      type: Number,
      default: 18
    },
    phone: {
      type: String
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: 'Country'
    },
    state: {
      type: Object
    },
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cities'
    },
    profile: {
      type: Object
    },
    cover: {
      type: Object
    },
    nationalId: {
      type: Object
    },
    // subscription price, legacy name, means price for 30 day now
    pricePerDay: {
      type: Number,
      default: 1
    },
    pricePerMessage: {
      type: Number,
      default: 9999
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services'
      }
    ],
    languages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'language'
      }
    ],
    urlTelegram: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    urlWhatsApp: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now
    },
    googleId: {
      type: String,
      select: false
    },
    messageBundles: [
      {
        model: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        messages: {
          type: Number,
          default: 0
        }
      }
    ],
    // Personal data used for verification
    personalFirstName: {
      type: String
    },
    personalSecondName: {
      type: String
    },
    personalFamilyName: {
      type: String
    },
    personalDayOfBirth: {
      type: Number
    },
    personalMonthOfBirth: {
      type: Number
    },
    personalYearOfBirth: {
      type: Number
    },
    personalSex: {
      type: String,
      enum: ['male', 'female']
    },
    personalCountry: {
      type: String
    },
    personalCity: {
      type: String
    },
    personalStreet: {
      type: String
    },
    personalBuilding: {
      type: String
    },
    personalAppartment: {
      type: String
    },
    personalZIP: {
      type: String
    },
    personalPassport: {
      type: Object
    },
    personalIDCardFront: {
      type: Object
    },
    personalIDCardBack: {
      type: Object
    },
    personalDriverLicenseFront: {
      type: Object
    },
    personalDriverLicenseBack: {
      type: Object
    },
    personalIDExpirationDay: {
      type: Number
    },
    personalIDExpirationMonth: {
      type: Number
    },
    personalIDExpirationYear: {
      type: Number
    },
    personalIDHasNoExpiration: {
      type: Boolean,
      default: false
    },
    personalSelfie: {
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
UserSchema.plugin(mongoosePaginate)
const Model = mongoose.model('User', UserSchema)

Model.find({ profileNum: { $gt: 0 } })
  .sort({ profileNum: -1 })
  .then((docs) => {
    if (docs && docs[0]) {
      numCounter = docs[0].profileNum + 1
    }
  })

module.exports = Model
