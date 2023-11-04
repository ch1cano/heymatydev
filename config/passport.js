const passport = require('passport')
const User = require('../app/models/user')
const auth = require('../app/middleware/auth')
const {
  createUserWithGoogle
} = require('../app/controllers/users/createUserWithGoogle')
const JwtStrategy = require('passport-jwt').Strategy
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GoogleIdTokenStrategy = require('passport-google-idtoken')

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token)
  }
  return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) {
      return done(err, false)
    }
    return !user ? done(null, false) : done(null, user)
  })
})

passport.use(jwtLogin)

const googleLogin = (role) =>
  new GoogleIdTokenStrategy({}, (profile, callback) => {
    User.findOne(
      {
        googleId: profile.sub
      },
      async (err, user) => {
        if (err) {
          return callback(err, null)
        }
        if (user) {
          return callback(null, user)
        }
        const userData = await createUserWithGoogle({
          displayName: profile.name,
          email: profile.email,
          role: role,
          googleId: profile.sub
        })

        return userData.ok
          ? callback(null, userData.item)
          : callback(new Error(userData.message))
      }
    )
  })

passport.use('google-idtoken-user', googleLogin('user'))
passport.use('google-idtoken-girl', googleLogin('girl'))

// const googleLogin = (type) =>
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       callbackURL: `http://localhost:8051/auth/google_callback/${type}`,
//       passReqToCallback: true
//     },
//     (req, token, tokenSecret, profile, done) => {
//       User.findOne({ googleId: profile.id }, async (err, user) => {
//         if (err) {
//           return done(err, null)
//         }
//         if (user) {
//           return done(null, user)
//         }
//         const {
//           id,
//           displayName,
//           emails: [{ value: email }]
//         } = profile
//         const userData = await createUserWithGoogle({
//           id,
//           displayName,
//           email,
//           role: req.params.role
//         })
//         return userData.ok
//           ? done(null, userData.item)
//           : done(new Error(userData.message))
//       })
//     }
//   )
//
// passport.use('google-role-girl', googleLogin('girl'))
// passport.use('google-role-user', googleLogin('user'))
